define( [ 'voxel/tool/constructor', 'voxel/tool/optor', 'voxel/algorithm', 'voxel/block', 'voxel/region' ], function ( constructor, optor, algorithm, Block, Region ) {
	
	var Engine = constructor( function ( options ) {
		
		options = optor( options, {
			
			blockClass : Block,
			
			regionClass : Region,
			
			dimensions : { blocks : [ 32, 32, 32 ], regions : [ 32, 64, 32 ] }
			
		} );
		
		this.blockClass = options.blockClass;
		
		this.regionClass = options.regionClass;
		
		this.dimensions = options.dimensions;
		
		this.regions = Object.create( null );
		
		this.blocks = Object.create( null );
		
		this.dirty = {
			
			regions : Object.create( null ),
			
			blocks : Object.create( null )
			
		};
		
	} );
	
	Engine.prototype.get = function ( x, y, z ) {
		
		var blocksDimensions = this.dimensions.blocks;
		
		// Calul des coordonnées et indexs du bloc mémoire.
		
		var blockPosition = [ ( x / blocksDimensions[ 0 ] ) | 0, ( y / blocksDimensions[ 1 ] ) | 0, ( z / blocksDimensions[ 2 ] ) | 0];
		var blockIndex = blockPosition.join( ':' );
		
		// On calcule la position puis l'index du voxel demandé dans le bloc.
		
		var voxelPosition = [ x % blocksDimensions[ 0 ], y % blocksDimensions[ 1 ], z % blocksDimensions[ 2 ] ];
		var voxelIndex = voxelPosition.join( ':' );
		
		// Récupération du bloc mémoire contenant le voxel traité.
		
		var block = this.blocks[ blockIndex ];
		
		// Si le bloc n'existe pas, le voxel est par défaut nul.
		
		if ( block === undefined )
			
			return null;
		
		// Récupération de la valeur du voxel au sein du bloc mémoire.
		
		var value = block.data[ voxelIndex ];
		
		// Si le voxel n'est pas défini dans le bloc, il vaut par défaut nul.
		
		if ( value === undefined )
			
			return null;
		
		// Enfin, si tout va bien, nous pouvons renvoyer la valeur du voxel.
		
		return value;
		
	};
	
	Engine.prototype.set = function ( x, y, z, value ) {
		
		// On vérifie si la valeur du bloc change. Si ce n'est pas le cas, on peut d'ores et déjà arrêter l'exécution.
		
		if ( this.get( x, y, z ) === value )
			
			return ;
		
		var blocksDimensions = this.dimensions.blocks;
		var regionsDimensions = this.dimensions.regions;
		
		// Calul des coordonnées et indexs du bloc mémoire.
		
		var blockPosition = [ ( x / blocksDimensions[ 0 ] ) | 0, ( y / blocksDimensions[ 1 ] ) | 0, ( z / blocksDimensions[ 2 ] ) | 0];
		var blockIndex = blockPosition.join( ':' );
		
		// On calcule la position puis l'index du voxel demandé dans le bloc.
		
		var voxelPosition = [ x % blocksDimensions[ 0 ], y % blocksDimensions[ 1 ], z % blocksDimensions[ 2 ] ];
		var voxelIndex = voxelPosition.join( ':' );
		
		// Récupération du bloc mémoire contenant le voxel traité.
		
		var block = this.blocks[ blockIndex ];
		
		// S'il n'y a pas de bloc, on en créé un vide.
		// S'il est partagé, on le duplique. Il faudra plus tard vérifier son homogénéité.
		
		if ( block === undefined )
			
			block = this.blocks[ blockIndex ] = this.dirty.blocks[ blockIndex ] = new ( this.blockClass )( );
		
		else if ( block.references > 1 )
			
			block = this.blocks[ blockIndex ] = this.dirty.blocks[ blockIndex ] = block.extract( );
		
		// Modifie la valeur du voxel.
		
		block.data[ voxelIndex ] = value;
		
		// On calcule la position de la région principale (au centre).
		
		var regionPosition = [ ( x / regionsDimensions[ 0 ] ) | 0, ( y / regionsDimensions[ 1 ] ) | 0, ( z / regionsDimensions[ 2 ] ) | 0 ];
		
		// Petite fonction dont le but est de marquer comme "sale" les régions contenant le vortex et devant être recalculées.
		// (cela permettant une groose factorisation du code, voir après)
		
		var makeDirty = function ( x, y, z ) {
			
			// On calcule la position puis l'index de la région que l'on traite.
			// Les coordonnées en paramètres sont relatives à la région principale (laquelle est donc 0, 0, 0).
			
			var currentRegionPosition = [ regionPosition[ 0 ] + x, regionPosition[ 1 ] + y, regionPosition[ 2 ] + z ];
			var currentRegionIndex = currentRegionPosition.join( ':' );
			
			// Récupération de la région concernée.
			
			var region = this.regions[ currentRegionIndex ];
			
			// Si cette dernière n'existe pas, on la créé.
			
			if ( region === undefined ) {
				
				region = this.regions[ currentRegionIndex ] = new ( this.regionClass )( currentRegionPosition, regionsDimensions );
				
				this.onRegionCreate( region );
				
			}
			
			// On marque enfin la région comme "sale", et devant être recalculée.
			
			this.dirty.regions[ currentRegionIndex ] = region;
			
		}.bind( this );
		
		// La région centrale est forcément salie.
		
		makeDirty( 0, 0, 0 );
		
		// Pour les zones adjacentes, c'est moins sûr et un test doit être fait pour chacune.
		// Note personnelle : j'ai pleuré en écrivant ces lignes.
		
		if ( voxelPosition[ 0 ] === regionPosition[ 0 ] ) makeDirty( - 1, 0, 0 );
		
		if ( voxelPosition[ 0 ] === regionPosition[ 0 ] + regionsDimensions[ 0 ] ) makeDirty( 1, 0, 0 );
		
		if ( voxelPosition[ 1 ] === regionPosition[ 1 ] ) makeDirty( 0, - 1, 0 );
		
		if ( voxelPosition[ 1 ] === regionPosition[ 1 ] + regionsDimensions[ 0 ] ) makeDirty( 0, 1, 0 );
		
		if ( voxelPosition[ 2 ] === regionPosition[ 2 ] ) makeDirty( 0, 0, - 1 );
		
		if ( voxelPosition[ 2 ] === regionPosition[ 2 ] + regionsDimensions[ 0 ] ) makeDirty( 0, 0, 1 );
		
		if ( voxelPosition[ 0 ] === regionPosition[ 0 ] && voxelPosition[ 1 ] === regionPosition[ 1 ] ) makeDirty( - 1, - 1, 0 );
		
		if ( voxelPosition[ 0 ] === regionPosition[ 0 ] && voxelPosition[ 1 ] === regionPosition[ 1 ] + regionsDimensions[ 1 ] ) makeDirty( - 1, 1, 0 );
		
		if ( voxelPosition[ 0 ] === regionPosition[ 0 ] + regionsDimensions[ 0 ] && voxelPosition[ 1 ] === regionPosition[ 1 ] ) makeDirty( 1, - 1, 0 );
		
		if ( voxelPosition[ 0 ] === regionPosition[ 0 ] + regionsDimensions[ 0 ] && voxelPosition[ 1 ] === regionPosition[ 1 ] + regionsDimensions[ 1 ] ) makeDirty( 1, 1, 0 );
		
		if ( voxelPosition[ 0 ] === regionPosition[ 0 ] && voxelPosition[ 2 ] === regionPosition[ 2 ] ) makeDirty( - 1, 0, - 1 );
		
		if ( voxelPosition[ 0 ] === regionPosition[ 0 ] && voxelPosition[ 2 ] === regionPosition[ 2 ] + regionsDimensions[ 2 ] ) makeDirty( - 1, 0, 1 );
		
		if ( voxelPosition[ 0 ] === regionPosition[ 0 ] + regionsDimensions[ 0 ] && voxelPosition[ 2 ] === regionPosition[ 2 ] ) makeDirty( 1, 0, - 1 );
		
		if ( voxelPosition[ 0 ] === regionPosition[ 0 ] + regionsDimensions[ 0 ] && voxelPosition[ 2 ] === regionPosition[ 2 ] + regionsDimensions[ 2 ] ) makeDirty( 1, 0, 1 );
		
		if ( voxelPosition[ 1 ] === regionPosition[ 1 ] && voxelPosition[ 2 ] === regionPosition[ 2 ] ) makeDirty( 0, - 1, - 1 );
		
		if ( voxelPosition[ 1 ] === regionPosition[ 1 ] && voxelPosition[ 2 ] === regionPosition[ 2 ] + regionsDimensions[ 2 ] ) makeDirty( 0, - 1, 1 );
		
		if ( voxelPosition[ 1 ] === regionPosition[ 1 ] + regionsDimensions[ 1 ] && voxelPosition[ 2 ] === regionPosition[ 2 ] ) makeDirty( 0, 1, - 1 );
		
		if ( voxelPosition[ 1 ] === regionPosition[ 1 ] + regionsDimensions[ 1 ] && voxelPosition[ 2 ] === regionPosition[ 2 ] + regionsDimensions[ 2 ] ) makeDirty( 0, 1, 1 );
		
		if ( voxelPosition[ 0 ] === regionPosition[ 0 ] && voxelPosition[ 1 ] === regionPosition[ 1 ] && voxelPosition[ 2 ] === regionPosition[ 2 ] ) makeDirty( - 1, - 1, - 1 );
		
		if ( voxelPosition[ 0 ] === regionPosition[ 0 ] + regionsDimensions[ 0 ] && voxelPosition[ 1 ] === regionPosition[ 1 ] && voxelPosition[ 2 ] === regionPosition[ 2 ] ) makeDirty( 1, - 1, - 1 );
		
		if ( voxelPosition[ 0 ] === regionPosition[ 0 ] && voxelPosition[ 1 ] === regionPosition[ 1 ] + regionsDimensions[ 1 ] && voxelPosition[ 2 ] === regionPosition[ 2 ] ) makeDirty( - 1, 1, - 1 );
		
		if ( voxelPosition[ 0 ] === regionPosition[ 0 ] && voxelPosition[ 1 ] === regionPosition[ 1 ] && voxelPosition[ 2 ] === regionPosition[ 2 ] + regionsDimensions[ 2 ] ) makeDirty( - 1, - 1, 1 );
		
		if ( voxelPosition[ 0 ] === regionPosition[ 0 ] + regionsDimensions[ 0 ] && voxelPosition[ 1 ] === regionPosition[ 1 ] + regionsDimensions[ 1 ] && voxelPosition[ 2 ] === regionPosition[ 2 ] ) makeDirty( 1, 1, - 1 );
		
		if ( voxelPosition[ 0 ] === regionPosition[ 0 ] + regionsDimensions[ 0 ] && voxelPosition[ 1 ] === regionPosition[ 1 ] && voxelPosition[ 2 ] === regionPosition[ 2 ] + regionsDimensions[ 2 ] ) makeDirty( 1, - 1, 1 );
		
		if ( voxelPosition[ 0 ] === regionPosition[ 0 ] && voxelPosition[ 1 ] === regionPosition[ 1 ] + regionsDimensions[ 1 ] && voxelPosition[ 2 ] === regionPosition[ 2 ] + regionsDimensions[ 2 ] ) makeDirty( - 1, 1, 1 );
		
		if ( voxelPosition[ 0 ] === regionPosition[ 0 ] + regionsDimensions[ 0 ] && voxelPosition[ 1 ] === regionPosition[ 1 ] + regionsDimensions[ 1 ] && voxelPosition[ 2 ] === regionPosition[ 2 ] + regionsDimensions[ 2 ] ) makeDirty( 1, 1, 1 );
		
	};
	
	Engine.prototype.update = function ( max ) {
		
		var keys = Object.keys( this.dirty.regions );
		var count = typeof max === 'undefined' ? keys.length : Math.min( max, keys.length );
		
		if ( ! count )
			return ;
		
		var date = new Date( );
		
		for ( var t = 0; t < count; ++ t ) {
			
			var key = keys[ t ];
			
			console.log( t + "/" + count + " : " + key );
			
			var region = this.dirty.regions[ key ];
			delete this.dirty.regions[ key ];
			
			region.onUpdateStart( );
			this.onRegionUpdateStart( region );
			
			algorithm( this, region );
			
			region.onUpdateEnd( );
			this.onRegionUpdateEnd( region );
			
		}
		
		console.log( "Update time : " + ( Math.floor( ( new Date( ) - date ) / 10 ) / 100 ) + 's' );
		
	};
	
	Engine.prototype.onRegionCreate = function ( region ) {
		
		/* User defined */
		
	};
	
	Engine.prototype.onRegionRemove = function ( region ) {
		
		/* User defined */
		
	};
	
	Engine.prototype.onRegionUpdateStart = function ( region ) {
		
		/* User defined */
		
	};
	
	Engine.prototype.onRegionUpdateEnd = function ( region ) {
		
		/* User defined */
		
	};
	
	return Engine;
	
} );
