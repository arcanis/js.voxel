VOXEL.Block = function ( sourceBuffer ) {

	this.needsMerge = false;

	this.referenceCount = 0;

	this.buffer = sourceBuffer ? VOXEL.Block.cloneBuffer( sourceBuffer ) : VOXEL.Block.createBuffer( );
	this.dataView = new Uint32Array( this.buffer );

};

VOXEL.Block.getIndexFromCoordinates = function ( x, y, z ) {

	var blockWidth = VOXEL.Block.width;
	var blockHeight = VOXEL.Block.height;
	var blockDepth = VOXEL.Block.depth;

	return Math.abs( z ) * blockWidth * blockHeight + Math.abs( y ) * blockWidth + Math.abs( x );

};

VOXEL.Block.createBuffer = function ( ) {

	var blockWidth = VOXEL.Block.width;
	var blockHeight = VOXEL.Block.height;
	var blockDepth = VOXEL.Block.depth;

	var buffer = new ArrayBuffer( blockWidth * blockHeight * blockDepth * 4 );
	var dataView = new Uint8Array( buffer );

	for ( var t = 0, T = buffer.byteLength; t < T; ++ t )
		dataView[ t ] = 0xFF;

	return buffer;

};

VOXEL.Block.cloneBuffer = function ( buffer ) {

	return buffer.slice( 0 );

};

VOXEL.Block.prototype.set = function ( x, y, z, value ) {

	this.dataView[ VOXEL.Block.getIndexFromCoordinates( x, y, z ) ] = value;

};

VOXEL.Block.prototype.get = function ( x, y, z ) {

	return this.dataView[ VOXEL.Block.getIndexFromCoordinates( x, y, z ) ];

};

VOXEL.Block.prototype.clone = function ( ) {

	return new VOXEL.Block( this.buffer );

};
