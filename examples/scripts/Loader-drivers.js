var texture = function ( name, url ) {
    this.weight = 1;
    this.start = function ( data, callback ) {
        THREE.ImageUtils.loadTexture( url, null, function ( texture ) {
            data[ name ] = texture;
            callback( );
        } );
    };
};

var direct = function ( fn ) {
    this.weight = 1;
    this.start = function ( data, callback ) {
        fn( data );
        callback( );
    };
};

var voxel = function ( weight, fn ) {
    this.weight = weight;
    this.start = function ( data, callback ) {
        fn( function ( infos ) {
            callback( infos.progress.success / infos.progress.total );
        } );
    };
};
