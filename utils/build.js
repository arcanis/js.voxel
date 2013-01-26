var fs = require( 'fs' );

var UglifyJS = require( 'uglify-js' );

var getSourceCode = function ( list ) {
    return list.map( function ( path ) {
        return fs.readFileSync( path, 'utf8' );
    } ).join( '\n' ); };

var uglifySourceCode = function ( sources ) {
    return UglifyJS
        .minify( sources, {
            compress : {
                global_defs : {
                    REGION_WIDTH : 16,
                    REGION_HEIGHT : 16,
                    REGION_DEPTH : 16
                } } } ).code; };

var clientSources = [

    'src/client/namespace.js',

    'src/client/Manager/ThreeManager.js',

    'src/client/Loader/BinvoxLoader.js',

    'src/client/Core/CreateWorker.js',
    'src/client/Core/VoxelEngine.js'

];

var workerSources = [

    'src/worker/namespace.js',

    'src/worker/Algorithm/Tables.js',

    'src/worker/Brush/BinvoxBrush.js',

    'src/worker/Region/Region.js',
    'src/worker/Region/RegionMap.js',

    'src/worker/Core/Application.js',
    'src/worker/Core/Main.js'

];

fs.writeFile( 'build/Voxel.js',
    uglifySourceCode( clientSources ) +
    'VOXEL.CreateWorker.dataScript = ' + JSON.stringify(
        uglifySourceCode( workerSources ) ) +
    ';' );
