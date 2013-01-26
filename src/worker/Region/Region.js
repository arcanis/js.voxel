VOXEL.Region = function ( regionMap, regionX, regionY, regionZ ) {

    this.needsUpdate = false;

    this.regionMap = regionMap;

    this.voxelX = regionX * REGION_WIDTH;
    this.voxelY = regionY * REGION_HEIGHT;
    this.voxelZ = regionZ * REGION_DEPTH;

};

VOXEL.Region.prototype.update = function ( callback ) {

    var db = this.regionMap.db;

    var polygons = [ ];

    var vertexOffsets = VOXEL.Tables.vertexOffsets;
    var edgeConnections = VOXEL.Tables.edgeConnections;
    var edgeDirections = VOXEL.Tables.edgeDirections;
    var edgeFlagMap = VOXEL.Tables.edgeFlagMap;
    var triangleConnections = VOXEL.Tables.triangleConnections;

    var get = function ( key ) {
        var v = db[ key ];
        return typeof v !== 'undefined'
            ? v
            : 0xffffffff;
    }.bind( this );

    for ( var regionRelativeX = 0, voxelX = this.voxelX; regionRelativeX < REGION_WIDTH; ++ regionRelativeX, ++ voxelX ) {
        for ( var regionRelativeY = 0, voxelY = this.voxelY; regionRelativeY < REGION_HEIGHT; ++ regionRelativeY, ++ voxelY ) {
            for ( var regionRelativeZ = 0, voxelZ = this.voxelZ; regionRelativeZ < REGION_DEPTH; ++ regionRelativeZ, ++ voxelZ ) {

                var cubeValues = [
                    get( [ voxelX + 0, voxelY + 0, voxelZ + 0 ].join( ',' ) ),
                    get( [ voxelX + 1, voxelY + 0, voxelZ + 0 ].join( ',' ) ),
                    get( [ voxelX + 1, voxelY + 1, voxelZ + 0 ].join( ',' ) ),
                    get( [ voxelX + 0, voxelY + 1, voxelZ + 0 ].join( ',' ) ),
                    get( [ voxelX + 0, voxelY + 0, voxelZ + 1 ].join( ',' ) ),
                    get( [ voxelX + 1, voxelY + 0, voxelZ + 1 ].join( ',' ) ),
                    get( [ voxelX + 1, voxelY + 1, voxelZ + 1 ].join( ',' ) ),
                    get( [ voxelX + 0, voxelY + 1, voxelZ + 1 ].join( ',' ) )
                ];

                var edgesFlagsIndex = ( 0
                    | ( cubeValues[ 0 ] !== 0xffffffff ? 1 << 0 : 0 )
                    | ( cubeValues[ 1 ] !== 0xffffffff ? 1 << 1 : 0 )
                    | ( cubeValues[ 2 ] !== 0xffffffff ? 1 << 2 : 0 )
                    | ( cubeValues[ 3 ] !== 0xffffffff ? 1 << 3 : 0 )
                    | ( cubeValues[ 4 ] !== 0xffffffff ? 1 << 4 : 0 )
                    | ( cubeValues[ 5 ] !== 0xffffffff ? 1 << 5 : 0 )
                    | ( cubeValues[ 6 ] !== 0xffffffff ? 1 << 6 : 0 )
                    | ( cubeValues[ 7 ] !== 0xffffffff ? 1 << 7 : 0 )
                );

                var edgesFlags = edgeFlagMap[ edgesFlagsIndex ];
                if ( edgesFlags === 0 ) continue;

                var edgesVertexes = { };

                for ( var t = 0; t < 12; ++ t ) {

                    if ( edgesFlags & ( 1 << t ) ) {

                        var edge = edgeConnections[ t ];

                        var edgeDirection = edgeDirections[ t ];

                        var verticeOffset = vertexOffsets[ edge[ 0 ] ];

                        edgesVertexes[ t ] = [
                            regionRelativeX + verticeOffset[ 0 ] + edgeDirection[ 0 ] / 2,
                            regionRelativeY + verticeOffset[ 1 ] + edgeDirection[ 1 ] / 2,
                            regionRelativeZ + verticeOffset[ 2 ] + edgeDirection[ 2 ] / 2,
                            cubeValues[ edge[ +( cubeValues[ edge[ 0 ] ] === 0xFFFFFFFF ) ] ]
                        ];

                    }

                }

                var connections = triangleConnections[ edgesFlagsIndex ];

                for ( var u = 0, U = connections.length / 3; u < U; ++ u ) {

                    var vertex_0 = edgesVertexes[ connections[ 3 * u + 0 ] ];
                    var vertex_1 = edgesVertexes[ connections[ 3 * u + 1 ] ];
                    var vertex_2 = edgesVertexes[ connections[ 3 * u + 2 ] ];

                    var axis_0 = [ vertex_1[ 0 ] - vertex_0[ 0 ], vertex_1[ 1 ] - vertex_0[ 1 ], vertex_1[ 2 ] - vertex_0[ 2 ] ];
                    var axis_1 = [ vertex_2[ 0 ] - vertex_0[ 0 ], vertex_2[ 1 ] - vertex_0[ 1 ], vertex_2[ 2 ] - vertex_0[ 2 ] ];

                    var crossProduct = [ axis_0[ 1 ] * axis_1[ 2 ] - axis_0[ 2 ] * axis_1[ 1 ], axis_0[ 2 ] * axis_1[ 0 ] - axis_0[ 0 ] * axis_1[ 2 ], axis_0[ 0 ] * axis_1[ 1 ] - axis_0[ 1 ] * axis_1[ 0 ] ];

                    var squareRoot = Math.sqrt( Math.pow( crossProduct[ 0 ], 2 ) + Math.pow( crossProduct[ 1 ], 2 ) + Math.pow( crossProduct[ 2 ], 2 ) );
                    var normal = [ - crossProduct[ 0 ] / squareRoot, - crossProduct[ 1 ] / squareRoot, - crossProduct[ 2 ] / squareRoot ];

                    polygons.push( [ [ vertex_0, vertex_1, vertex_2 ], normal ] );

                }

            }
        }
    }

    callback && callback.call( this, {
        position : [ this.voxelX, this.voxelY, this.voxelZ ],
        polygons : polygons } );

};
