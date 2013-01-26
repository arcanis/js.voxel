var fs = require( 'fs' );

var Glob = require( 'glob' );
var UglifyJS = require( 'uglify-js' );

var uglifySourceCode = function ( sources ) {
    return UglifyJS
        .minify( sources, {
            compress : {
                global_defs : {
                    REGION_WIDTH : 16,
                    REGION_HEIGHT : 16,
                    REGION_DEPTH : 16
                } } } ).code; };

fs.writeFileSync( 'build/Voxel.js',
    uglifySourceCode( Glob.sync( 'src/**/*.js' ) ) );
