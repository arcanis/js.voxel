var VOXEL = VOXEL || Object.create( null );

VOXEL.Region = ( function ( ) {

    var getPointKeyFromRelativePoint = function ( relativePoint ) {
        return relativePoint[ 2 ] * ( REGION_WIDTH + 1 ) * ( REGION_HEIGHT + 1 )
            + relativePoint[ 1 ] * ( REGION_WIDTH + 1 )
            + relativePoint[ 0 ]; };

    var createBuffer = function ( ) {
        var buffer = new ArrayBuffer( ( REGION_WIDTH + 1 ) * ( REGION_HEIGHT + 1 ) * ( REGION_DEPTH + 1 ) * 4 );
        for ( var array = new Uint32Array( buffer ), t = 0, T = array.length; t < T; ++ t ) array[ t ] = 0xffffffff;
        return buffer; };

    var Region = function ( ) {

        this.pendingRead = [ ];
        this.pendingWrite = { };

        this.dataless = false;

        this.buffer = createBuffer( );
        this.synchronize( );

    };

    Region.prototype.synchronize = function ( ) {

        var data = this.data = new Uint32Array( this.buffer );

        var pendingWrite = this.pendingWrite;
        this.pendingWrite = { };

        Object.keys( pendingWrite ).forEach( function ( writeKey ) {
            data[ writeKey ] = pendingWrite[ writeKey ];
        } );

        var pendingRead = this.pendingRead;
        this.pendingRead = { };

        Object.keys( pendingRead ).forEach( function ( readKey ) {
            pendingRead[ readKey ].forEach( function ( listener ) {
                listener( data[ readKey ] );
            } );
        } );

        return this;

    };

    Region.prototype.get = function ( relativePoint, callback ) {
        var pointKey = getPointKeyFromRelativePoint( relativePoint );

        if ( this.dataless ) {
            if ( this.pendingWrite[ pointKey ] ) {
                callback( this.pendingWrite[ pointKey ] );
            } else {
                if ( ! this.pendingRead[ pointKey ] ) this.pendingRead[ pointKey ] = [ ];
                this.pendingRead[ pointKey ].push( callback );
            }
        } else {
            callback( this.data[ pointKey ] );
        }
    };

    Region.prototype.set = function ( relativePoint, value, callback ) {
        var pointKey = getPointKeyFromRelativePoint( relativePoint );

        if ( this.dataless ) {
            this.pendingWrite[ pointKey ] = value;
        } else {
            this.data[ pointKey ] = value;
        }

        callback( );
    };

    return Region;

} )( );
