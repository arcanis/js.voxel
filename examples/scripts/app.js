var voxelManager, voxelEngine;

var start = function ( ) {
    var draw = false;

    var queue = [ ];
    var chrono;

    var cast = function ( e ) {
        var x = e.clientX, y = e.clientY;
        var direction = new THREE.Vector3( ( x / width ) * 2 - 1, - ( y / height ) * 2 + 1, 1 );
        var projector = new THREE.Projector( );
        projector.unprojectVector( direction, camera );
        direction.sub( camera.position ).normalize( );

        var raycaster = new THREE.Raycaster( camera.position, direction, 0, 1000 );
        var intersects = raycaster.intersectObjects( scene.children, true );

        if ( intersects.length === 0 ) return ;

        var size = 4;

        var voxel = intersects[ 0 ].point.clone( ), normal = intersects[ 0 ].face.normal.clone( ).normalize( );
        voxel.x = Math.floor( ( voxel.x + normal.x * size / 2 ) / size ) * size;
        voxel.y = Math.floor( ( voxel.y + normal.y * size / 2 ) / size ) * size;
        voxel.z = Math.floor( ( voxel.z + normal.z * size / 2 ) / size ) * size;

        for ( var x = 0; x < size; ++ x )
            for ( var y = 0; y < size; ++ y )
                for ( var z = 0; z < size; ++ z )
                    voxelEngine.set( voxel.x + x, voxel.y + y, voxel.z + z, y < size / 4 * 3 ? 1 : 0 );

        voxelEngine.commit( );
    };

    $( document ).mousedown( function ( e ) {
        draw = true; cast( e ); } );

    $( document ).mouseup( function ( ) {
        draw = false; } );

    $( document ).mousemove( function ( e ) {
        if ( ! draw ) return ;
        cast( e );
    } );
};

window.onload = function ( ) { create( function ( ) {

    camera.position.set( 30, 30, 30 );
    camera.updateMatrix( );
    camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

    var loader = new Loader( );

    loader.push( texture, 'grass', 'images/grass.png' );
    loader.push( texture, 'dirt', 'images/dirt.png' );

    loader.push( direct, function ( data ) {
        scene.add( ( voxelManager = new VOXEL.ThreeManager( [
            new THREE.MeshLambertMaterial( { map : data.grass } ),
            new THREE.MeshLambertMaterial( { map : data.dirt } )
        ] ) ).object3D );
    } );

    loader.push( voxel, 100, function ( callback ) {
        voxelEngine = new VOXEL.VoxelEngine( voxelManager );

        for ( var x = - 50; x <= 50; ++ x )
            for ( var z = - 50; z <= 50; ++ z )
                voxelEngine.set( x, 0, z, 0 );

        voxelEngine.commit( callback );
    } );

    $( document.body ).addClass( 'ok' ).addClass( 'hard-loading' );
    loader.start( function ( progress ) {
        if ( progress === 1 ) {
            $( document.body ).removeClass( 'hard-loading' ); start( );
        } else {
            $( '#loading .cursor' ).css( 'width', ( progress * 100 ) + '%' );
        }
    } );

} ); };
