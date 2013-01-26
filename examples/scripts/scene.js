var renderer, scene, camera, controls, light;
var delta, width, height;

function create( initializer, updater ) {

    renderer = new THREE.WebGLRenderer( {
        canvas : document.getElementById( 'screen' ),
        antialias : true
    } );

    scene = new THREE.Scene( );

    camera = new THREE.PerspectiveCamera( 60, 1, .001, 10000 );
    scene.add( camera );

    controls = new THREE.FirstPersonControls( camera );
    controls.movementSpeed = 10;
    controls.lookSpeed = 0.125;
    controls.lookVertical = true;

    light = new THREE.PointLight( 0xffffff );
    light.position = camera.position;
    scene.add( light );

    var clock = new THREE.Clock( );

    var updateScreen = window.onresize = function ( ) {
        width = window.innerWidth, height = window.innerHeight;
        renderer.setSize( width, height );
        camera.aspect = width / height;
        camera.updateProjectionMatrix( );
    };

    var cycleRendering = function ( ) {
        window.requestAnimationFrame( cycleRendering );
        delta = clock.getDelta( );
        if ( updater ) updater( );
        //controls.update( delta );
        renderer.render( scene, camera );
    };

    var returnValues = initializer( );
    if ( returnValues ) updater = updater.bind.apply( updater, returnValues );

    updateScreen( );
    cycleRendering( );

}
