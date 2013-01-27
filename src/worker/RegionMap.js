var VOXEL = VOXEL || Object.create( null );

VOXEL.RegionMap = function ( db ) {

    this.db = db || Object.create( null );

    this.indexedRegions = Object.create( null );
    this.regionsNeedingUpdate = [ ];

};

VOXEL.RegionMap.prototype.prepareRegion = function ( regionX, regionY, regionZ ) {

    var regionKey = regionZ * REGION_WIDTH * REGION_HEIGHT + regionY * REGION_WIDTH + regionX;

    return ( this.indexedRegions[ regionKey ] )
        || ( this.indexedRegions[ regionKey ] = new VOXEL.Region( this, regionX, regionY, regionZ ) );

};

VOXEL.RegionMap.prototype.prepareRegionUpdate = function ( regionX, regionY, regionZ ) {

    var region = this.prepareRegion( regionX, regionY, regionZ );

    if ( ! region.needsUpdate) {
        this.regionsNeedingUpdate.push( region );
        region.needsUpdate = true;
    }

};

VOXEL.RegionMap.prototype.set = function ( voxelX, voxelY, voxelZ, value ) {

    var regionX = Math.floor( voxelX / REGION_WIDTH );
    var regionY = Math.floor( voxelY / REGION_HEIGHT );
    var regionZ = Math.floor( voxelZ / REGION_DEPTH );

    var isXAdjacent = voxelX % REGION_WIDTH === 0;
    var isYAdjacent = voxelY % REGION_HEIGHT === 0;
    var isZAdjacent = voxelZ % REGION_DEPTH === 0;

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

    var voxelKey = [ voxelX, voxelY, voxelZ ].join( ',' );
    this.db[ voxelKey ] = value;

};

VOXEL.RegionMap.prototype.updateAll = function ( callback ) {

    var regionsNeedingUpdate = this.regionsNeedingUpdate;

    var total = regionsNeedingUpdate.length, success = 0;

    while ( regionsNeedingUpdate.length ) {
        regionsNeedingUpdate.shift( ).update( function ( infos ) {

            this.needsUpdate = false;

            callback && callback.call( this, {
                update : {
                    position : infos.position,
                    polygons : infos.polygons },
                progress : {
                    total : total,
                    success : ++ success } } );

        } );
    }

};
