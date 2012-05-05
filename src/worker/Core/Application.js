VOXEL.Application = function ( ) {

	this.models = Object.create( null );

};

VOXEL.Application.prototype.onMessage = function ( event ) {

	var message = event.data;

	switch ( message.command ) {

	case 'initialization':
		this.onInitializationCommand( message.configuration );
		break ;

	case 'commit':
		this.onCommitCommand( message.operations );
		break ;

	}

};

VOXEL.Application.prototype.onInitializationCommand = function ( configuration ) {

	VOXEL.Region.width = configuration.region[ 0 ];
	VOXEL.Region.height = configuration.region[ 1 ];
	VOXEL.Region.depth = configuration.region[ 2 ];

	VOXEL.Block.width = configuration.block[ 0 ];
	VOXEL.Block.height = configuration.block[ 1 ];
	VOXEL.Block.depth = configuration.block[ 2 ];

	this.regionMap = new VOXEL.RegionMap( );

};

VOXEL.Application.prototype.onCommitCommand = function ( operations ) {

	var set = this.regionMap.set.bind( this.regionMap );

	for ( var t = 0, T = operations.length; t < T; ++ t ) {

		var operation = operations[ t ];

		switch ( operation.type ) {

		case 'set':
			this.onSetOperation( operation.x, operation.y, operation.z, operation.value );
			break ;

		case 'prepare':
			this.onPrepareOperation( operation.id, operation.model );
			break ;

		case 'apply':
			this.onApplyOperation( operation.id, operation.arguments );
			break ;

		case 'release':
			this.onReleaseOperation( operation.id );
			break ;

		}

		set( operation[ 0 ], operation[ 1 ], operation[ 2 ], operation[ 3 ] );

	}

	this.regionMap.blockMap.mergeAll( );
	this.regionMap.updateAll( );

};

VOXEL.Application.prototype.onSetOperation = function ( voxelX, voxelY, voxelZ, value ) {

	this.regionMap.set( voxelX, voxelY, voxelZ, value );

};

VOXEL.Application.prototype.onPrepareOperation = function ( id, model ) {

	this.models[ id ] = model;

};

VOXEL.Application.prototype.onApplyOperation = function ( id, arguments ) {

	var model = this.models[ id ];

	var type = model.type.charAt( 0 ).toUpperCase( ) + model.type.substr( 1 ).toLowerCase( ) + 'Brush';

	VOXEL[ type ].apply( null, [ model, this.regionMap ].concat( arguments ) );

};

VOXEL.Application.prototype.onReleaseOperation = function ( id ) {

	this.models[ id ] = null;
	delete this.models[ id ];

};
