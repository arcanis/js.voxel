VOXEL.Region = function ( regionMap, x, y, z ) {

	this.needsUpdate = false;

	this.regionMap = regionMap;

	this.x = x;
	this.y = y;
	this.z = z;

};

VOXEL.Region.prototype.update = function ( ) {

	var polygons = [ ];

	var regionWidth = VOXEL.Region.width;
	var regionHeight = VOXEL.Region.height;
	var regionDepth = VOXEL.Region.depth;

	var vertexOffsets = VOXEL.Tables.vertexOffsets;
	var edgeConnections = VOXEL.Tables.edgeConnections;
	var edgeDirections = VOXEL.Tables.edgeDirections;
	var edgeFlagMap = VOXEL.Tables.edgeFlagMap;
	var triangleConnections = VOXEL.Tables.triangleConnections;

	var beginningX = this.x * regionWidth;
	var beginningY = this.y * regionHeight;
	var beginningZ = this.z * regionDepth;

	this.regionMap.blockMap.resetCache( );
	var get = this.regionMap.blockMap.get.bind( this.regionMap.blockMap );

	for ( var regionRelativeX = 0; regionRelativeX < regionWidth; ++ regionRelativeX ) {
		for ( var regionRelativeY = 0; regionRelativeY < regionHeight; ++ regionRelativeY ) {
			for ( var regionRelativeZ = 0; regionRelativeZ < regionDepth; ++ regionRelativeZ ) {

				var voxelX = beginningX + regionRelativeX;
				var voxelY = beginningY + regionRelativeY;
				var voxelZ = beginningZ + regionRelativeZ;

				var cubeValues = [
					get( voxelX + 0, voxelY + 0, voxelZ + 0 ),
					get( voxelX + 1, voxelY + 0, voxelZ + 0 ),
					get( voxelX + 1, voxelY + 1, voxelZ + 0 ),
					get( voxelX + 0, voxelY + 1, voxelZ + 0 ),
					get( voxelX + 0, voxelY + 0, voxelZ + 1 ),
					get( voxelX + 1, voxelY + 0, voxelZ + 1 ),
					get( voxelX + 1, voxelY + 1, voxelZ + 1 ),
					get( voxelX + 0, voxelY + 1, voxelZ + 1 )
				];

				var edgesFlagsIndex = (
					( cubeValues[ 0 ] !== 0xFFFFFFFF ? 1 << 0 : 0) |
					( cubeValues[ 1 ] !== 0xFFFFFFFF ? 1 << 1 : 0) |
					( cubeValues[ 2 ] !== 0xFFFFFFFF ? 1 << 2 : 0) |
					( cubeValues[ 3 ] !== 0xFFFFFFFF ? 1 << 3 : 0) |
					( cubeValues[ 4 ] !== 0xFFFFFFFF ? 1 << 4 : 0) |
					( cubeValues[ 5 ] !== 0xFFFFFFFF ? 1 << 5 : 0) |
					( cubeValues[ 6 ] !== 0xFFFFFFFF ? 1 << 6 : 0) |
					( cubeValues[ 7 ] !== 0xFFFFFFFF ? 1 << 7 : 0)
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
							regionRelativeZ + verticeOffset[ 2 ] + edgeDirection[ 2 ] / 2
						];

					}

				}

				var triangles = triangleConnections[ edgesFlagsIndex ];

				for ( var u = 0, U = triangles.length / 3; u < U; ++ u ) {

					var vertexes = [ null, null, null ];

					for ( var v = 0; v < 3; ++ v ) {

						var vertexIndex = triangles[ 3 * u + v ];

						var vertex = vertexes[ v ] = edgesVertexes[ vertexIndex ];

						vertex[ 3 ] = cubeValues[ edge[ +( cubeValues[ edge[ 0 ] ] === 0xFFFFFFFF ) ] ];

					}

					var firstAxis = [ vertexes[ 1 ][ 0 ] - vertexes[ 0 ][ 0 ], vertexes[ 1 ][ 1 ] - vertexes[ 0 ][ 1 ], vertexes[ 1 ][ 2 ] - vertexes[ 0 ][ 2 ] ];
					var secondAxis = [ vertexes[ 2 ][ 0 ] - vertexes[ 0 ][ 0 ], vertexes[ 2 ][ 1 ] - vertexes[ 0 ][ 1 ], vertexes[ 2 ][ 2 ] - vertexes[ 0 ][ 2 ] ];

					var crossProduct = [ firstAxis[ 1 ] * secondAxis[ 2 ] - firstAxis[ 2 ] * secondAxis[ 1 ], firstAxis[ 2 ] * secondAxis[ 0 ] - firstAxis[ 0 ] * secondAxis[ 2 ], firstAxis[ 0 ] * secondAxis[ 1 ] - firstAxis[ 1 ] * secondAxis[ 0 ] ];

					var squareRoot = Math.sqrt( Math.pow( crossProduct[ 0 ], 2 ) + Math.pow( crossProduct[ 1 ], 2 ) + Math.pow( crossProduct[ 2 ], 2 ) );
					var normal = [ - crossProduct[ 0 ] / squareRoot, - crossProduct[ 1 ] / squareRoot, - crossProduct[ 2 ] / squareRoot ];

					polygons.push( [ vertexes, normal ] );

				}

			}
		}
	}

	self.postMessage( {
		command : 'update',
		position : [ beginningX, beginningY, beginningZ ],
		polygons : polygons
	} );

};
