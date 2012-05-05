VOXEL.RegionMap = function ( blockMap ) {

	this.blockMap = blockMap || new VOXEL.BlockMap( );

	this.indexedRegions = Object.create( null );
	this.regionsNeedingUpdate = [ ];

};

VOXEL.RegionMap.prototype.prepareRegionUpdate = function ( regionX, regionY, regionZ ) {

	regionX = Math.floor( regionX );
	regionY = Math.floor( regionY );
	regionZ = Math.floor( regionZ );

	var regionIdentifier = regionX + '/' + regionY + '/' + regionZ;

	var region = this.indexedRegions[ regionIdentifier ];

	if ( !region )
		region = this.indexedRegions[ regionIdentifier ] = new VOXEL.Region( this, regionX, regionY, regionZ );

	if ( !region.needsUpdate) {

		this.regionsNeedingUpdate.push( region );
		region.needsUpdate = true;

	}

};

VOXEL.RegionMap.prototype.set = function ( voxelX, voxelY, voxelZ, value ) {

	voxelX = Math.floor( voxelX );
	voxelY = Math.floor( voxelY );
	voxelZ = Math.floor( voxelZ );

	var regionWidth = VOXEL.Region.width;
	var regionHeight = VOXEL.Region.height;
	var regionDepth = VOXEL.Region.depth;

	var regionX = Math.floor( voxelX / regionWidth );
	var regionY = Math.floor( voxelY / regionHeight );
	var regionZ = Math.floor( voxelZ / regionDepth );

	var isXAdjacent = voxelX % regionWidth === 0;
	var isYAdjacent = voxelY % regionHeight === 0;
	var isZAdjacent = voxelZ % regionDepth === 0;

	if ( true )
		this.prepareRegionUpdate( regionX, regionY, regionZ );

	if ( isXAdjacent )
		this.prepareRegionUpdate( regionX - 1, regionY, regionZ );

	if ( isYAdjacent )
		this.prepareRegionUpdate( regionX, regionY - 1, regionZ );

	if ( isZAdjacent )
		this.prepareRegionUpdate( regionX, regionY, regionZ - 1 );

	if ( isXAdjacent && isYAdjacent )
		this.prepareRegionUpdate( regionX - 1, regionY - 1, regionZ );

	if ( isXAdjacent && isZAdjacent )
		this.prepareRegionUpdate( regionX - 1, regionY, regionZ - 1 );

	if ( isYAdjacent && isZAdjacent )
		this.prepareRegionUpdate( regionX, regionY - 1, regionZ - 1 );

	if ( isXAdjacent && isYAdjacent && isZAdjacent )
		this.prepareRegionUpdate( regionX - 1, regionY - 1, regionZ - 1 );

	this.blockMap.set( voxelX, voxelY, voxelZ, value );

};

VOXEL.RegionMap.prototype.get = function ( voxelX, voxelY, voxelZ ) {

	return this.blockMap.get( voxelX, voxelY, voxelZ );

};

VOXEL.RegionMap.prototype.updateAll = function ( ) {

	var regionsNeedingUpdate = this.regionsNeedingUpdate;

	for ( var t = 0, T = regionsNeedingUpdate.length; t < T; ++ t ) {

		var regionNeedingUpdate = regionsNeedingUpdate[ t ];

		regionNeedingUpdate.update( );

		regionNeedingUpdate.needsUpdate = false;

	}

};
