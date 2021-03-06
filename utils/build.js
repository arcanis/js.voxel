var fs = require( 'fs' );

var Glob = require( 'glob' );
var UglifyJS = require( 'uglify-js' );

var uglifySourceCode = function ( sources ) {
    return UglifyJS
        .minify( sources, {
            compress : {
                global_defs : {
                    REGION_WIDTH : 10,
                    REGION_HEIGHT : 10,
                    REGION_DEPTH : 10
                } } } ).code; };

fs.writeFileSync( 'build/Voxel.js',
    uglifySourceCode( [ ].concat( Glob.sync( 'src/client/**/!(export.js)+(*.js)' ) ) ) +
    'VOXEL.Scheduler.workerScript=' + JSON.stringify(
        uglifySourceCode( [ ].concat( Glob.sync( 'src/worker/**/!(main.js)+(*.js)' ), [ 'src/worker/main.js' ] ) ) ) + ';' );
