define( function ( ) {
	
	return function ( fn ) {
		
		fn.prototype.constructor = fn;
		
		return fn;
		
	};
	
} );
