var VOXEL = VOXEL || Object.create( null );

VOXEL.getMainRegionKeyFromWorldVoxel = function ( worldVoxel ) {
    return [ Math.floor( worldVoxel[ 0 ] / REGION_WIDTH )
           , Math.floor( worldVoxel[ 1 ] / REGION_HEIGHT )
           , Math.floor( worldVoxel[ 2 ] / REGION_DEPTH ) ]; };

VOXEL.getRegionVoxelFromWorldVoxel = function ( worldVoxel, regionKey ) {
    return [ worldVoxel[ 0 ] - regionKey[ 0 ] * REGION_WIDTH
           , worldVoxel[ 1 ] - regionKey[ 1 ] * REGION_HEIGHT
           , worldVoxel[ 2 ] - regionKey[ 2 ] * REGION_DEPTH ]; };
