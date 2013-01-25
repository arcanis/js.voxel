VOXEL.BinvoxLoader = function ( path, callback ) {

    var xhr = new XMLHttpRequest( );

    xhr.onload = function ( ) { callback( VOXEL.BinvoxLoader.parse( xhr.responseText ) ); };

    xhr.open( 'GET', path, true );
    xhr.overrideMimeType( 'text/plain; charset=x-user-defined' );
    xhr.send( null );

};

VOXEL.BinvoxLoader.format = /^#binvox 1\ndim ([0-9]*[1-9][0-9]*) (?:\1) (?:\1)\ntranslate (-?(?:[0-9]+(?:\.[0-9]*)?|[0-9]*\.[0-9]+)) (-?(?:[0-9]+(?:\.[0-9]*)?|[0-9]*\.[0-9]+)) (-?(?:[0-9]+(?:\.[0-9]*)?|[0-9]*\.[0-9]+))\nscale ([1-9][0-9]*(?:\.[0-9]*)?|0*\.[0-9]*[1-9][0-9]*)\ndata\n((?:[\S\s]{2})*)$/;

VOXEL.BinvoxLoader.parse = function ( content ) {

    var parts = content.match( VOXEL.BinvoxLoader.format );

    if ( ! parts )
        throw new Error( 'Syntax error' );

    var index = 0;

    var size = Number( parts[ 1 ] );
    var translation = [ Number( parts[ 2 ] ), Number( parts[ 3 ] ), Number( parts[ 4 ] ) ];
    var scale = Number( parts[ 5 ] );
    var raw = parts[ 6 ];
    var ranges = [ ];

    for ( var t = 0, T = raw.length; t < T; t += 2 ) {

        var status = raw.charCodeAt( t ) & 0xFF;
        var count = raw.charCodeAt( t + 1 ) & 0xFF;

        if ( [ 0, 1 ].indexOf( status ) === -1 || count < 1 || count > 0xFF )
            throw new Error( 'Invalid value : ' + status + ', ' + count );

        if ( status )
            ranges.push( [ index, index + count ] );

        index += count;

    }

    var expected = Math.pow( size, 3 );
    if ( index !== expected )
        throw new Error( 'Bad voxel count (found ' + index + ', expected ' + expected + ')' );

    return {
        type : 'binvox',
        size : size,
        translation : translation,
        scale : scale,
        ranges : ranges
    };

};
