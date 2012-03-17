define( [ 'voxel/tool/constructor' ], function ( constructor ) {
	
	var Block = constructor( function ( orig ) {
		
		this.references = 1;
		
		var data = this.data = Object.create( null );
		
		if ( orig !== undefined ) {
			
			Object.keys( orig ).forEach( function ( index ) {
				
				data[ index ] = orig[ index ];
				
			} );
			
		}
		
	} );
	
	Block.prototype.extract = function ( ) {
		
		-- this.references;
		
		return new ( this.constructor )( this.data );
		
	};
	
	return Block;
	
} );
