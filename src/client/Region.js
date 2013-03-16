var VOXEL = VOXEL || Object.create( null );

VOXEL.Region = ( function ( ) {

    var getPointKeyFromRelativePoint = function ( relativePoint ) { return 0
        + relativePoint[ 2 ] * ( REGION_WIDTH + 1 ) * ( REGION_HEIGHT + 1 )
        + relativePoint[ 1 ] * ( REGION_WIDTH + 1 )
        + relativePoint[ 0 ]; };

    var Region = function ( ) {

        this.buffer = new ArrayBuffer( ( REGION_WIDTH + 1 ) * ( REGION_HEIGHT + 1 ) * ( REGION_DEPTH + 1 ) * 4 );

        this.data = new Uint32Array( this.buffer );

        for ( var array = this.data, t = 0, T = array.length; t < T; ++ t )
            array[ t ] = 0xffffffff;
    };

    Region.prototype.get = function ( relativePoint ) {

        return this.data[ getPointKeyFromRelativePoint( relativePoint ) ];

    };

    Region.prototype.set = function ( relativePoint, value ) {

        this.data[ getPointKeyFromRelativePoint( relativePoint ) ] = value;

        return this;

    };

    return Region;

} )( );
