define( function ( ) {
	
	var Class = function ( position, dimensions ) {
		
		this.position = position;
		
		this.dimensions = dimensions;
		
	};
	
	Class.prototype.onVertex = function ( vertice ) {
		
		/* User defined */
		
	};
	
	Class.prototype.onTriangle = function ( vertices ) {
		
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
