define( function ( ) {
	
	var BlockMap = function ( engine ) {
		
		this.engine = engine;
		
		this.cache = Object.create( null );
		
	};
	
	BlockMap.prototype.get = function ( x, y, z ) {
		
		var index = [ x, y, z ].join( ';' );
		
		var value = this.cache[ index ];
		
		if ( value === undefined )
			
			value = this.cache[ index ] = this.engine.get( x, y, z );
		
		return value;
		
	};
	
	return BlockMap;
	
} );
