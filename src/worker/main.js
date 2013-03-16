self.onmessage = function ( event ) {

    var buffer = event.data.buffer;
    var polygons = [ ];

    var db = new Uint32Array( buffer );

    var vertexOffsets = Tables.vertexOffsets;
    var edgeConnections = Tables.edgeConnections;
    var edgeDirections = Tables.edgeDirections;
    var edgeFlagMap = Tables.edgeFlagMap;
    var triangleConnections = Tables.triangleConnections;

    var getVoxelIndex = function ( x, y, z ) { return 0
        + z * ( REGION_WIDTH + 1 ) * ( REGION_HEIGHT + 1 )
        + y * ( REGION_WIDTH + 1 )
        + x; };

    var setLayerVoxel = function ( layers, data, id ) {
        var value = data[ id ];

        if ( data[ id ] === 0xffffffff )
            return ;

        var layerId = value >> 24;

        if ( layers[ layerId ] === undefined ) {

            layers.keys.push( layerId );

            var layer = layers[ layerId ] = [
                0xffffffff,
                0xffffffff,
                0xffffffff,
                0xffffffff,
                0xffffffff,
                0xffffffff,
                0xffffffff,
                0xffffffff
            ];

        }

        layers[ layerId ][ id ] = value;
    };

    for ( var voxelX = 0; voxelX < REGION_WIDTH; ++ voxelX ) {
        for ( var voxelY = 0; voxelY < REGION_HEIGHT; ++ voxelY ) {
            for ( var voxelZ = 0; voxelZ < REGION_DEPTH; ++ voxelZ ) {

                var voxelData = [
                    db[ getVoxelIndex( voxelX + 0, voxelY + 0, voxelZ + 0 ) ],
                    db[ getVoxelIndex( voxelX + 1, voxelY + 0, voxelZ + 0 ) ],
                    db[ getVoxelIndex( voxelX + 1, voxelY + 1, voxelZ + 0 ) ],
                    db[ getVoxelIndex( voxelX + 0, voxelY + 1, voxelZ + 0 ) ],
                    db[ getVoxelIndex( voxelX + 0, voxelY + 0, voxelZ + 1 ) ],
                    db[ getVoxelIndex( voxelX + 1, voxelY + 0, voxelZ + 1 ) ],
                    db[ getVoxelIndex( voxelX + 1, voxelY + 1, voxelZ + 1 ) ],
                    db[ getVoxelIndex( voxelX + 0, voxelY + 1, voxelZ + 1 ) ]
                ];

                var layers = [ ];
                layers.keys = [ ];

                setLayerVoxel( layers, voxelData, 0 );
                setLayerVoxel( layers, voxelData, 1 );
                setLayerVoxel( layers, voxelData, 2 );
                setLayerVoxel( layers, voxelData, 3 );
                setLayerVoxel( layers, voxelData, 4 );
                setLayerVoxel( layers, voxelData, 5 );
                setLayerVoxel( layers, voxelData, 6 );
                setLayerVoxel( layers, voxelData, 7 );

                for ( var l = 0, L = layers.keys.length; l < L; ++ l ) {

                    var cubeValues = layers[ layers.keys[ l ] ];

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
                    if ( edgesFlags === 0 ) continue ;

                    var edgesVertexes = { };

                    for ( var t = 0; t < 12; ++ t ) {

                        if ( edgesFlags & ( 1 << t ) ) {

                            var edge = edgeConnections[ t ];

                            var edgeDirection = edgeDirections[ t ];

                            var verticeOffset = vertexOffsets[ edge[ 0 ] ];

                            edgesVertexes[ t ] = [
                                voxelX + verticeOffset[ 0 ] + edgeDirection[ 0 ] / 2,
                                voxelY + verticeOffset[ 1 ] + edgeDirection[ 1 ] / 2,
                                voxelZ + verticeOffset[ 2 ] + edgeDirection[ 2 ] / 2,
                                cubeValues[ edge[ +( cubeValues[ edge[ 0 ] ] === 0xffffffff ) ] ]
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
    }

    self.postMessage( {
        command : 'complete',
        data : { polygons : polygons }
    } );

};
