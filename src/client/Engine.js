var VOXEL = VOXEL || Object.create( null );

VOXEL.Engine = ( function ( ) {

    var getMainRegionKeyFromWorldPoint = function ( worldPoint ) {
        return [ Math.floor( worldPoint[ 0 ] / REGION_WIDTH )
               , Math.floor( worldPoint[ 1 ] / REGION_HEIGHT )
               , Math.floor( worldPoint[ 2 ] / REGION_DEPTH ) ]; };

    var getRegionPointFromWorldPoint = function ( worldPoint, regionKey ) {
        return [ worldPoint[ 0 ] - regionKey[ 0 ]
               , worldPoint[ 1 ] - regionKey[ 1 ]
               , worldPoint[ 2 ] - regionKey[ 2 ] ]; };

    var Engine = function ( fetch ) {

        VOXEL.Emitter( this )
            .addEventType( 'regionFetched' )
            .addEventType( 'regionMissing' )
            .addEventType( 'regionUpdated' )
            .addEventType( 'regionPolygonized' );

        this.regions = Object.create( null );

        this.scheduler = new VOXEL.Scheduler( 4 );

        this.scheduler.on( 'taskQueued', function ( event ) {

            var regionKey = event.task.regionKey
              , region = this.regions[ regionKey ];

            region.scheduled = true;

        }, this );

        this.scheduler.on( 'taskSent', function ( event ) {

            var regionKey = event.task.regionKey
              , region = event.task.region;

            region.dirty = false;

            region.buffer = false;
            region.dataless = true;

        }, this );

        this.scheduler.on( 'taskCompleted', function ( event ) {

            var regionKey = event.task.regionKey
              , region = event.task.region;

            region.scheduled = false;

            region.buffer = event.data.buffer;
            region.dataless = false;

            region.synchronize( );

            this.update( regionKey );

            this.trigger( 'regionPolygonized', new VOXEL.Engine.RegionPolygonizedEvent( regionKey, region, event.data.polygons ) );

        }, this );

        this.on( 'regionFetched regionUpdated', function ( event ) {

            var regionKey = event.regionKey
              , region = event.region;

            region.dirty = true;

            this.update( regionKey );

        }, this );

    };

    Engine.prototype.fetch = function ( regionKey, callback ) {

        var regionFetchCallback = function ( region ) {
            this.regions[ regionKey ] = region;
            region && this.trigger( 'regionFetched', new VOXEL.Engine.RegionFetchedEvent( regionKey, region ) );
            callback( region );
        }.bind( this );

        if ( typeof this.regions[ regionKey ] === 'undefined' ) {
            var event = new VOXEL.Engine.RegionMissingEvent( regionKey );
            this.trigger( 'regionMissing', event, regionFetchCallback );
            event.isDefaultPrevented( ) || callback( null );
        } else {
            callback( this.regions[ regionKey ] );
        }

        return this;

    };

    Engine.prototype.update = function ( regionKey ) {

        var region = this.regions[ regionKey ];

        if ( ! region.dirty || region.scheduled )
            return ;

        region.scheduled = true;
        region.dirty = false;

        this.scheduler.queue( {
            regionKey : regionKey,
            region : region,
            data : { buffer : region.buffer },
            transfers : [ region.buffer ]
        } );

    };

    Engine.prototype.get = function ( worldPoint, callback ) {

        var regionKey = getMainRegionKeyFromWorldPoint( worldPoint );
        var regionPoint = getRegionPointFromWorldPoint( worldPoint, regionKey );

        this.fetch( regionKey, function ( region ) {
            if ( region === null ) callback( null );
            else region.get( regionPoint, callback );
        }.bind( this ) );

        return this;

    };

    Engine.prototype.set = function ( worldPoint, value, callback ) {

        var apply = function ( regionKey, regionPoint, callback, allowFetching ) {
            callback = callback || function ( ) { };
            if ( ! this.regions[ regionKey ] && ! allowFetching ) return ;
            this.fetch( regionKey, function ( region ) {
                if ( region === null ) callback( false );
                else region.set( regionPoint, value, function ( ) {
                    callback( true );
                    this.trigger( 'regionUpdated', new VOXEL.Engine.RegionUpdatedEvent( regionKey, region, regionPoint, value ) );
                }.bind( this ) );
            }.bind( this ) );
        }.bind( this );

        var checkNeighbor = function ( cx, cy, cz ) {
            if ( ( ! cx || regionPoint[ 0 ] === 0 )
              && ( ! cy || regionPoint[ 1 ] === 0 )
              && ( ! cz || regionPoint[ 2 ] === 0 ) )
                apply( [ regionKey[ 0 ] - cx,
                         regionKey[ 1 ] - cy,
                         regionKey[ 2 ] - cz ],
                       [ ! cx ? regionPoint[ 0 ] : REGION_WIDTH,
                         ! cy ? regionPoint[ 1 ] : REGION_HEIGHT,
                         ! cz ? regionPoint[ 2 ] : REGION_DEPTH ],
                       null,
                       false ); };

        var regionKey = getMainRegionKeyFromWorldPoint( worldPoint );
        var regionPoint = getRegionPointFromWorldPoint( worldPoint, regionKey );

        checkNeighbor( 1, 0, 0 );
        checkNeighbor( 0, 1, 0 );
        checkNeighbor( 0, 0, 1 );
        checkNeighbor( 1, 1, 0 );
        checkNeighbor( 0, 1, 1 );
        checkNeighbor( 1, 0, 1 );
        checkNeighbor( 1, 1, 1 );

        apply( regionKey, regionPoint, callback, true );

        return this;

    };

    Engine.RegionMissingEvent = function ( regionKey ) {

        var isDefaultPrevented = false;
        this.preventDefault = function ( ) { isDefaultPrevented = true; };
        this.isDefaultPrevented = function ( ) { return isDefaultPrevented; };

        this.regionKey = regionKey;

    };

    Engine.RegionFetchedEvent = function ( regionKey, region ) {

        this.regionKey = regionKey;
        this.region = region;

    };

    Engine.RegionUpdatedEvent = function ( regionKey, region, regionPoint, value ) {

        this.regionKey = regionKey;
        this.region = region;

        this.regionPoint = regionPoint;
        this.value = value;

    };

    Engine.RegionPolygonizedEvent = function ( regionKey, region, polygons ) {

        this.regionKey = regionKey;
        this.region = region;

        this.polygons = polygons;

    };

    return Engine;

} )( );
