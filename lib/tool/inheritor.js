define( [ 'voxel/tool/constructor' ], function ( constructor ) {
	
	return function ( parent, fn ) {
		
		var F = function ( ) { };
		F.prototype = parent.prototype;
		
		fn.prototype = new F( );
		
		return constructor( fn );
		
	};
	
} );
