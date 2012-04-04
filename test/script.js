require( [ 'three', 'stats', 'voxel/extra/three/helper', 'voxel/extra/three/material', './data', 'domReady!' ], function ( Three, Stats, VoxelHelper, VoxelMaterial, Data ) {
	
	var stats = new Stats( );
	stats.getDomElement( ).style.position = 'absolute';
	stats.getDomElement( ).style.left = '0px';
	stats.getDomElement( ).style.top = '0px';
	document.body.appendChild( stats.getDomElement( ) );
	
	var renderer = new Three.WebGLRenderer( );
	document.body.appendChild( renderer.domElement );
	renderer.domElement.style.background = 'black';
	renderer.domElement.style.position = 'absolute';
	renderer.domElement.style.left = '0';
	renderer.domElement.style.top = '0';
	
	var camera = new Three.PerspectiveCamera( 60, 1, .01, 20000 );
	camera.position = new Three.Vector3( 120, 160, 120 );
	camera.updateMatrix( );
	camera.lookAt( new Three.Vector3( 0, 0, 0 ) );
	
	var pointLight = new Three.PointLight( 0xffffff );
	pointLight.position = camera.position;
	
	var ambientLight = new Three.AmbientLight( 0 );
	
	var voxelHelper = new VoxelHelper( 20 );
	
	var scene = new Three.Scene( );
	scene.add( new Three.AxisHelper( ) );
	scene.add( camera );
	scene.add( pointLight );
	scene.add( ambientLight );
	scene.add( voxelHelper );
	
	var vector = new Three.Vector3( );
	
	var limit = [ 100, 40, 100 ];
	
	console.log( 'Importing data ...' );
	
	for ( var z = 0, Z = Math.min( limit[ 2 ], Data.length ); z < Z; ++ z ) {
		
		for ( var x = 0, X = Math.min( limit[ 0 ], Data[ z ].length ); x < X; ++ x ) {
			
			for ( var y = 0, Y = Data[ z ][ x ] / 200 * limit[ 1 ]; y < Y; ++ y ) {
				
				voxelHelper.setVoxel( vector.set( x, y, z ), 0x57A84C );
				
			}
			
		}
		
	}
	
	console.log('> Done.');
	
	var clock = new Three.Clock( );
	
	window.addEventListener( 'resize', function ( ) {
		
		var resize = function ( ) {
			
			renderer.setSize( window.innerWidth, window.innerHeight );
			
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix( );
			
			return resize;
			
		};
		
		return resize( );
		
	}( ) );
	
	window.addEventListener( 'blur', function ( ) {
		
		clock.stop( );
		
	} );
	
	window.addEventListener( 'focus', function ( ) {
		
		clock.start( );
		
	} );
	
	window.requestAnimationLoop( function ( ) {
		
		voxelHelper.update( );
		
		stats.update( );
		
		renderer.render( scene, camera );
		
	} );
	
} );
