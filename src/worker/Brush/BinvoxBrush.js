VOXEL.BinvoxBrush = function ( model, regionMap, beginningX, beginningY, beginningZ, value ) {

	var size = model.size;
	var translation = model.translation;
	var scale = model.scale;
	var ranges = model.ranges;

	var padX = translation[ 0 ] / scale;
	var padY = translation[ 1 ] / scale;
	var padZ = translation[ 2 ] / scale;

	for ( var t = 0, T = ranges.length; t < T; ++ t ) {

		var range = ranges[ t ];

		for ( var u = range[ 0 ], U = range[ 1 ]; u < U; ++ u ) {

			var modelRelativeX = Math.floor( u / size / size % size );
			var modelRelativeY = Math.floor( u % size );
			var modelRelativeZ = Math.floor( u / size % size );

			var voxelX = Math.floor( beginningX + padX + modelRelativeX );
			var voxelY = Math.floor( beginningY + padY + modelRelativeY );
			var voxelZ = Math.floor( beginningZ + padZ + modelRelativeZ );

			regionMap.set( voxelX, voxelY, voxelZ, value );

		}

	}

};
