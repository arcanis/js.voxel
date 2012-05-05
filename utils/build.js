var fs = require( 'fs' );

var parser = require( 'uglify-js' ).parser;
var uglify = require( 'uglify-js' ).uglify;

var getSourceCode = function ( list ) {

	return list.map( function ( path ) {

		return fs.readFileSync( path, 'utf8' );

	} ).join( '\n' );

};

var uglifySourceCode = function ( sourceCode ) {

	var ast = parser.parse( sourceCode );

	ast = uglify.ast_mangle( ast );
	ast = uglify.ast_squeeze( ast );

	return uglify.gen_code( ast );

};

var clientSourceCode = getSourceCode( [

	'src/client/namespace.js',

	'src/client/Manager/ThreeManager.js',

	'src/client/Loader/BinvoxLoader.js',

	'src/client/Core/CreateWorker.js',
	'src/client/Core/VoxelEngine.js'

] );

var workerSourceCode = getSourceCode( [

	'src/worker/namespace.js',

	'src/worker/Algorithm/Tables.js',

	'src/worker/Brush/BinvoxBrush.js',

	'src/worker/Block/Block.js',
	'src/worker/Block/BlockMap.js',

	'src/worker/Region/Region.js',
	'src/worker/Region/RegionMap.js',

	'src/worker/Core/Application.js',
	'src/worker/Core/Main.js'

] );

fs.writeFile( 'build/Voxel.js',
	uglifySourceCode(
		clientSourceCode + '\n' +
		'VOXEL.CreateWorker.dataScript = ' + JSON.stringify(
			uglifySourceCode(
				workerSourceCode
			)
		) + ';'
	)
);
