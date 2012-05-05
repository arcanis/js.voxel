function create( initializer, updater ) {

	var Three = THREE;

	var renderer = new Three.WebGLRenderer( { antialias : true } );

	var scene = new Three.Scene( );

	var camera = new Three.PerspectiveCamera( 60, 1, .001, 10000 );
	scene.add( camera );

	var controls = new Three.FirstPersonControls( camera );
	controls.movementSpeed = 10;
	controls.lookSpeed = 0.125;
	controls.lookVertical = true;

	var light = new Three.PointLight( 0xffffff );
	light.position = camera.position;
	scene.add( light );

	var clock = new Three.Clock( );

	var updateScreen = function ( ) {
		renderer.setSize( window.innerWidth, window.innerHeight );
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix( );
	};

	var cycleRendering = function ( ) {
		window.requestAnimationFrame( cycleRendering );
		var delta = clock.getDelta( );
		if ( updater ) updater( delta );
		//controls.update( delta );
		renderer.render( scene, camera );
	};

	var finalize = function ( ) {
		updateScreen( );
		cycleRendering( );
		document.body.appendChild( renderer.domElement );
	};

	var returnValues = initializer( scene, camera );
	if ( returnValues ) {
		returnValues.unshift( null );
		updater = updater.bind.apply( updater, returnValues );
	}

	window.onresize = updateScreen;
	window.onload = finalize;

}
