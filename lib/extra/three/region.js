define( [ 'three', 'voxel/tool/inheritor', 'voxel/extra/three/material', 'voxel/region' ], function ( Three, inheritor, Material, Super ) {
	
	var Region = inheritor( Super, function ( position, dimensions ) {
		
		Super.call( this, position, dimensions );
		
		var verticesCounts = [ dimensions[ 0 ] + 1, dimensions[ 1 ] + 1, dimensions[ 2 ] + 1 ];
		var verticesCount = verticesCounts[ 0 ] * verticesCounts[ 1 ] * verticesCounts[ 2 ];
		
		this.material = new Three.MeshLambertMaterial( { vertexColors: Three.FaceColors } );
		
	} );
	
	Region.prototype.onUpdateStart = function ( ) {
		
		Super.prototype.onUpdateStart.call( this );
		
		var geometry = this.geometry = new Three.Geometry( );
		var mesh = this.mesh = new Three.Mesh( geometry, this.material );
		
		var position = this.position, dimensions = this.dimensions;
		
		mesh.position.x = position[ 0 ] * dimensions[ 0 ];
		mesh.position.y = position[ 1 ] * dimensions[ 1 ];
		mesh.position.z = position[ 2 ] * dimensions[ 2 ];
		
		this.cache = { };
		
	};
	
	Region.prototype.onUpdateEnd = function ( ) {
		
		this.geometry.computeBoundingSphere( );
		
	};
	
	Region.prototype.onTriangle = function ( vertexes, normal ) {
		
		Super.prototype.onTriangle.call( this, vertexes );
		
		var getIndex = function ( vertex ) {
			
			var index = vertex.join( ':' );
			
			if ( ! ( index in this.cache ) ) {
				
				var rindex = this.geometry.vertices.length;
				
				this.cache[ index ] = rindex;
				
				this.geometry.vertices.push( new Three.Vertex( new Three.Vector3( vertex[ 0 ], vertex[ 1 ], vertex[ 2 ] ) ) );
				
				return rindex;
				
			} else {
				
				return this.cache[ index ];
				
			}
			
		}.bind( this );
		
		var face = new Three.Face3( getIndex( vertexes[ 2 ] ), getIndex( vertexes[ 1 ] ), getIndex( vertexes[ 0 ] ) );
		
		var r = Math.min( parseInt( ( ( ( vertexes[ 0 ][ 3 ] & 0xff0000 ) + ( vertexes[ 1 ][ 3 ] & 0xff0000 ) + ( vertexes[ 2 ][ 3 ] & 0xff0000 ) ) >> 16 ) / 3 ), 0xff ) / 0xff;
		var g = Math.min( parseInt( ( ( ( vertexes[ 0 ][ 3 ] & 0x00ff00 ) + ( vertexes[ 1 ][ 3 ] & 0x00ff00 ) + ( vertexes[ 2 ][ 3 ] & 0x00ff00 ) ) >>  8 ) / 3 ), 0xff ) / 0xff;
		var b = Math.min( parseInt( ( ( ( vertexes[ 0 ][ 3 ] & 0x0000ff ) + ( vertexes[ 1 ][ 3 ] & 0x0000ff ) + ( vertexes[ 2 ][ 3 ] & 0x0000ff ) ) >>  0 ) / 3 ), 0xff ) / 0xff;
		
		face.color.setRGB( r, g, b );
		
		var normalVector = new Three.Vector3( normal[ 0 ], normal[ 1 ], normal[ 2 ] );
		
		face.normal = normalVector;
		
		face.vertexNormals.push( normalVector );
		face.vertexNormals.push( normalVector );
		face.vertexNormals.push( normalVector );
		
		this.geometry.faces.push( face );
		
	};
	
	return Region;
	
} );
