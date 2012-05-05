VOXEL.BlockMap = function ( ) {

	this.indexedBlocks = Object.create( null );
	this.blocksNeedingMerge = [ ];

	this.resetCache( );

};

VOXEL.BlockMap.prototype.resetCache = function ( ) {

	this.cache = { };

};

VOXEL.BlockMap.prototype.set = function ( voxelX, voxelY, voxelZ, value ) {

	voxelX = Math.floor( voxelX );
	voxelY = Math.floor( voxelY );
	voxelZ = Math.floor( voxelZ );

	var blockWidth  = VOXEL.Block.width;
	var blockHeight = VOXEL.Block.height;
	var blockDepth  = VOXEL.Block.depth;

	var blockX = Math.floor( voxelX / blockWidth );
	var blockY = Math.floor( voxelY / blockHeight );
	var blockZ = Math.floor( voxelZ / blockDepth );

	var blockIndex = blockX + '/' + blockY + '/' + blockZ;

	var block = this.indexedBlocks[ blockIndex ];

	if ( ! block )
		block = this.indexedBlocks[ blockIndex ] = new VOXEL.Block( );

	if ( ! block.needsMerge ) {

		this.blocksNeedingMerge.push( block );
		block.needsMerge = true;

	}

	block.set( voxelX % blockWidth, voxelY % blockHeight, voxelZ % blockDepth, value );

};

VOXEL.BlockMap.prototype.get = function ( voxelX, voxelY, voxelZ ) {

	voxelX = Math.floor( voxelX );
	voxelY = Math.floor( voxelY );
	voxelZ = Math.floor( voxelZ );

	var voxelIndex = voxelX + '/' + voxelY + '/' + voxelZ;

	if ( voxelIndex in this.cache )
		return this.cache[ voxelIndex ];

	var blockWidth  = VOXEL.Block.width;
	var blockHeight = VOXEL.Block.height;
	var blockDepth  = VOXEL.Block.depth;

	var blockX = Math.floor( voxelX / blockWidth );
	var blockY = Math.floor( voxelY / blockHeight );
	var blockZ = Math.floor( voxelZ / blockDepth );

	var blockIndex = blockX + '/' + blockY + '/' + blockZ;

	var block = this.indexedBlocks[ blockIndex ];

	return block ? block.get( voxelX % blockWidth, voxelY % blockHeight, voxelZ % blockDepth ) : 0xFFFFFFFF;

};

VOXEL.BlockMap.prototype.mergeAll = function ( ) {

};
