window.requestFrame = function ( fn ) {
	
	return this.setTimeout( fn, 1000 / 60 );
	
};

window.requestLoop = function ( fn ) {
	
	var wrapper = function ( ) {
		
		this.requestFrame( wrapper );
		
		fn( );
		
	}.bind( window );
	
	wrapper( );
	
};

window.requestAnimationFrame = ( function ( ) {
	
	if ( window.requestAnimationFrame )
		
		return window.requestAnimationFrame;
	
	if ( window.webkitRequestAnimationFrame )
		
		return window.webkitRequestAnimationFrame;
	
	if ( window.mozRequestAnimationFrame )
		
		return window.mozRequestAnimationFrame;
	
	if ( window.oRequestAnimationFrame )
		
		return window.oRequestAnimationFrame;
	
	if ( window.ieRequestAnimationFrame )
		
		return window.ieRequestAnimationFrame;
	
	return window.requestFrame;
	
} )( );

window.requestAnimationLoop = function ( fn ) {
	
	var wrapper = function ( ) {
		
		this.requestAnimationFrame( wrapper );
		
		fn( );
		
	}.bind( window );
	
	wrapper( );
	
};

require( {
	
	paths : {
		
		// Three.js
		three : 'vendor/three/amd',
		
		// Stats.js
		stats : 'vendor/stats/amd',
		
		// Voxel.js library path
		voxel : '../lib',
		
		// Require.js plugins
		order : 'vendor/require/order',
		text : 'vendor/require/text',
		domReady : 'vendor/require/domReady'
		
	}
	
} );
