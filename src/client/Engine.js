var VOXEL = VOXEL || Object.create( null );

VOXEL.Engine = ( function ( ) {

    var Engine = function ( fetch ) {

        VOXEL.Emitter( this )
            .addEventType( 'regionPolygonized' );

        this.regions = Object.create( null );
        this.dirtyRegions = [ ];

        this.tasksetId = 0;
        this.tasksets = Object.create( null );

        this.scheduler = new VOXEL.Scheduler( 4 );

        this.scheduler.on( 'taskCompleted', function ( e ) {

            var taskset = this.tasksets[ e.task.tasksetId ];
            taskset.progress += 1;

            var regionPolygonizedEvent = new VOXEL.Engine.RegionPolygonizedEvent( e.task.regionKey, e.task.region, e.data.polygons );

            this.trigger( 'regionPolygonized', regionPolygonizedEvent );

            taskset.callback( null, taskset.total, taskset.progress );

        }, this );

    };

    Engine.prototype.getRegion = function ( regionKey ) {

        var descriptor = this.regions[ regionKey ];

        return descriptor ? descriptor.region : undefined;

    };

    Engine.prototype.setRegion = function ( regionKey, region ) {

        var importBorders = function ( cx, cy, cz ) {

            var descriptor = this.regions[[ regionKey[ 0 ] + cx, regionKey[ 1 ] + cy, regionKey[ 2 ] + cz ]];
            if ( ! descriptor ) return ;

            for ( var x = 0, X = cx ? 1 : REGION_WIDTH; x < X; ++ x ) {
                for ( var y = 0, Y = cy ? 1 : REGION_HEIGHT; y < Y; ++ y ) {
                    for ( var z = 0, Z = cz ? 1 : REGION_DEPTH; z < Z; ++ z ) {
                        region.set( [
                            ( ! cx ? x : REGION_WIDTH ),
                            ( ! cy ? y : REGION_HEIGHT ),
                            ( ! cz ? z : REGION_DEPTH )
                        ], descriptor.region.get( [
                            cx ? 0 : x,
                            cy ? 0 : y,
                            cz ? 0 : z
                        ] ) );
                    }
                }
            }

        }.bind( this );

        var exportBorders = function ( cx, cy, cz ) {

            var descriptor = this.regions[[ regionKey[ 0 ] + cx, regionKey[ 1 ] + cy, regionKey[ 2 ] + cz ]];
            if ( ! descriptor ) return ;

            for ( var x = 0, X = cx ? 1 : REGION_WIDTH; x < X; ++ x ) {
                for ( var y = 0, Y = cy ? 1 : REGION_HEIGHT; y < Y; ++ y ) {
                    for ( var z = 0, Z = cz ? 1 : REGION_DEPTH; z < Z; ++ z ) {
                        descriptor.region.set( [
                            ( ! cx ? x : REGION_WIDTH ),
                            ( ! cy ? y : REGION_HEIGHT ),
                            ( ! cz ? z : REGION_DEPTH )
                        ], region.get( [
                            cx ? 0 : x,
                            cy ? 0 : y,
                            cz ? 0 : z
                        ] ) );
                    }
                }
            }

        }.bind( this );

        importBorders( + 1, + 0, + 0 );
        importBorders( + 1, + 1, + 0 );
        importBorders( + 0, + 1, + 0 );
        importBorders( + 0, + 0, + 1 );
        importBorders( + 1, + 0, + 1 );
        importBorders( + 1, + 1, + 1 );
        importBorders( + 0, + 1, + 1 );

        exportBorders( - 1, - 0, - 0 );
        exportBorders( - 1, - 1, - 0 );
        exportBorders( - 0, - 1, - 0 );
        exportBorders( - 0, - 0, - 1 );
        exportBorders( - 1, - 0, - 1 );
        exportBorders( - 1, - 1, - 1 );
        exportBorders( - 0, - 1, - 1 );

        var descriptor = this.regions[ regionKey ] || { region : null, version : 0, dirty : false };
        this.regions[ regionKey ] = descriptor;

        if ( ! descriptor.dirty )
            this.dirtyRegions.push( regionKey.slice( ) );

        descriptor.dirty = true;
        descriptor.region = region;
        descriptor.version += 1;

    };

    Engine.prototype.getVoxel = function ( worldVoxel ) {

        var regionKey = VOXEL.getMainRegionKeyFromWorldVoxel( worldVoxel );
        var regionVoxel = VOXEL.getRegionVoxelFromWorldVoxel( worldVoxel, regionKey );

        var descriptor = this.regions[ regionKey ];

        return descriptor ? descriptor.region.get( regionVoxel ) : undefined;

    };

    Engine.prototype.setVoxel = function ( worldVoxel, value ) {

        var setRegionVoxel = function ( regionKey, regionVoxel ) {

            var descriptor = this.regions[ regionKey ];
            if ( ! descriptor ) return ;

            if ( ! descriptor.dirty )
                this.dirtyRegions.push( regionKey.slice( ) );

            descriptor.region.set( regionVoxel, value );
            descriptor.dirty = true;

        }.bind( this );

        var checkNeighbor = function ( cx, cy, cz ) {

            if ( ( cx && regionVoxel[ 0 ] !== 0 ) || ( cy && regionVoxel[ 1 ] !== 0 ) || ( cz && regionVoxel[ 2 ] !== 0 ) )
                return ;
		
            setRegionVoxel( [
                regionKey[ 0 ] + cx,
                regionKey[ 1 ] + cy,
                regionKey[ 2 ] + cz
            ], [
                ! cx ? regionVoxel[ 0 ] : REGION_WIDTH,
                ! cy ? regionVoxel[ 1 ] : REGION_HEIGHT,
                ! cz ? regionVoxel[ 2 ] : REGION_DEPTH
            ] );

        };

        var regionKey = VOXEL.getMainRegionKeyFromWorldVoxel( worldVoxel );
        var regionVoxel = VOXEL.getRegionVoxelFromWorldVoxel( worldVoxel, regionKey );

        checkNeighbor( - 1, - 0, - 0 );
        checkNeighbor( - 0, - 1, - 0 );
        checkNeighbor( - 0, - 0, - 1 );
        checkNeighbor( - 1, - 1, - 0 );
        checkNeighbor( - 0, - 1, - 1 );
        checkNeighbor( - 1, - 0, - 1 );
        checkNeighbor( - 1, - 1, - 1 );

        setRegionVoxel( regionKey, regionVoxel );

        return this;

    };

    Engine.prototype.polygonize = function ( callback ) {

        var dirtyRegions = this.dirtyRegions;
        this.dirtyRegions = [ ];

        var tasksetId = this.tasksetId ++;
        this.tasksets[ tasksetId ] = {
            total : dirtyRegions.length, progress : 0,
            callback : callback || function ( ) { }
        };

        dirtyRegions.forEach( function ( regionKey ) {

            var descriptor = this.regions[ regionKey ];
            descriptor.dirty = false;
			
            this.scheduler.queue( {
                tasksetId : tasksetId,
                regionKey : regionKey,
                version : descriptor.version,
                data : { buffer : descriptor.region.buffer }
            } );

        }.bind( this ) );

        return this;

    };

    Engine.RegionPolygonizedEvent = function ( regionKey, region, polygons ) {

        this.regionKey = regionKey;
        this.region = region;

        this.polygons = polygons;

    };

    return Engine;

} )( );
