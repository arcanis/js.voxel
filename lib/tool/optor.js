define( function ( ) {
	
	return function ( user, def ) {
		
		var F = function ( ) { };
		F.prototype = def;
		
		var o = new F( );
		
		for ( var name in user )
			
			o[ name ] = user[ name ];
		
		return o;
		
	};
	
} );
