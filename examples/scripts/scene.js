function create( initializer, updater ) {

    var renderer = new THREE.WebGLRenderer( {
        canvas : document.getElementById( 'screen' ),
        antialias : true
    } );

    var scene = new THREE.Scene( );

    var camera = new THREE.PerspectiveCamera( 60, 1, .001, 10000 );
    scene.add( camera );

    var controls = new THREE.FirstPersonControls( camera );
    controls.movementSpeed = 10;
    controls.lookSpeed = 0.125;
    controls.lookVertical = true;

    var light = new THREE.PointLight( 0xffffff );
    light.position = camera.position;
    scene.add( light );

    var clock = new THREE.Clock( );

    var updateScreen = window.onresize = function ( ) {
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

    var returnValues = initializer( scene, camera );
    if ( returnValues ) updater = updater.bind.apply( updater, returnValues );

    updateScreen( );
    cycleRendering( );

}
