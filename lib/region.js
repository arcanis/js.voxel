define( function ( ) {
	
	var Class = function ( position, dimensions ) {
		
		this.position = position;
		
		this.dimensions = dimensions;
		
	};
	
	Class.prototype.onVoxel = function ( voxel ) {
		
		/* User defined */
		
	};
	
	Class.prototype.onTriangle = function ( voxels ) {
		
		/* User defined */
		
	};
	
	Class.prototype.onUpdateStart = function ( ) {
		
		/* User defined */
		
	};
	
	Class.prototype.onUpdateEnd = function ( ) {
		
		/* User defined */
		
	};
	
	return Class;
	
} );
