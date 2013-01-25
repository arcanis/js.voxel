window.onload = function ( ) { create( function ( scene, camera ) {

    camera.position.set( 100, 100, 100 );
    camera.updateMatrix( );
    camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

    var manager = new VOXEL.ThreeManager( );
    scene.add( manager.object3D );

    var voxelEngine = new VOXEL.VoxelEngine( manager );

    for ( var x = - 50; x <= 50; ++ x )
        for ( var z = - 50; z <= 50; ++ z )
            voxelEngine.set( x, 0, z, 0xff0000 );

    $( document.body ).addClass( 'ok' ).addClass( 'hard-loading' );
    voxelEngine.commit( function ( infos ) {
        if ( infos.progress.success === infos.progress.total ) $( document.body ).removeClass( 'hard-loading' );
        else $( '#loading .cursor' ).css( 'width', ( infos.progress.success / infos.progress.total * 100 ) + '%' );
    } );

} ); };
