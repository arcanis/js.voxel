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
                    voxelEngine.set( voxel.x + x, voxel.y + y, voxel.z + z, 0x0000ff );

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

    voxelManager = new VOXEL.ThreeManager( );
    scene.add( voxelManager.object3D );

    voxelEngine = new VOXEL.VoxelEngine( voxelManager );

    for ( var x = - 50; x <= 50; ++ x )
        for ( var z = - 50; z <= 50; ++ z )
            voxelEngine.set( x, 0, z, 0xff0000 );

    $( document.body ).addClass( 'ok' ).addClass( 'hard-loading' );
    voxelEngine.commit( function ( infos ) {
        if ( infos.progress.success === infos.progress.total ) {
            $( document.body ).removeClass( 'hard-loading' );
            start( );
        } else {
            $( '#loading .cursor' ).css( 'width', ( infos.progress.success / infos.progress.total * 100 ) + '%' );
        }
    } );

} ); };
