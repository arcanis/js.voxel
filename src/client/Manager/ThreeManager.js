VOXEL.ThreeManager = function ( ) {

	this.object3D = new THREE.Object3D( );

	this.regionMap = Object.create( null );

};

VOXEL.ThreeManager.prototype.onUpdateCommand = function ( position, polygons ) {

	var identifier = position.join( '/' );

	if ( typeof this.regionMap[ identifier ] === 'undefined' )
		this.object3D.remove( this.regionMap[ identifier ] );

	if ( ! polygons.length )
		return ;

	var vertexIndexCache = Object.create( null );

	var geometry = new THREE.Geometry( );
	var material = new THREE.MeshLambertMaterial( { vertexColors : THREE.VertexColors, shading : THREE.FlatShading } );

	var vertexes = geometry.vertices;
	var faces = geometry.faces;

	for ( var t = 0, T = polygons.length; t < T; ++ t ) {

		var polygon = polygons[ t ];

		var polygonVertexes = polygon[ 0 ];
		var polygonNormal = polygon[ 1 ];

		var vertex_0 = polygonVertexes[ 0 ];
		var vertex_1 = polygonVertexes[ 1 ];
		var vertex_2 = polygonVertexes[ 2 ];

		var vertexIdentifier_0 = vertex_0[ 0 ] + '/' + vertex_0[ 1 ] + '/' + vertex_0[ 2 ];
		var vertexIdentifier_1 = vertex_1[ 0 ] + '/' + vertex_1[ 1 ] + '/' + vertex_1[ 2 ];
		var vertexIdentifier_2 = vertex_2[ 0 ] + '/' + vertex_2[ 1 ] + '/' + vertex_2[ 2 ];

		var vertexIndex_0 = typeof vertexIndexCache[ vertexIdentifier_0 ] !== 'undefined' ? vertexIndexCache[ vertexIdentifier_0 ] : vertexIndexCache[ vertexIdentifier_0 ] = vertexes.push( new THREE.Vector3( vertex_0[ 0 ], vertex_0[ 1 ], vertex_0[ 2 ] ) ) - 1;
		var vertexIndex_1 = typeof vertexIndexCache[ vertexIdentifier_1 ] !== 'undefined' ? vertexIndexCache[ vertexIdentifier_1 ] : vertexIndexCache[ vertexIdentifier_1 ] = vertexes.push( new THREE.Vector3( vertex_1[ 0 ], vertex_1[ 1 ], vertex_1[ 2 ] ) ) - 1;
		var vertexIndex_2 = typeof vertexIndexCache[ vertexIdentifier_2 ] !== 'undefined' ? vertexIndexCache[ vertexIdentifier_2 ] : vertexIndexCache[ vertexIdentifier_2 ] = vertexes.push( new THREE.Vector3( vertex_2[ 0 ], vertex_2[ 1 ], vertex_2[ 2 ] ) ) - 1;

		var face = new THREE.Face3( vertexIndex_2, vertexIndex_1, vertexIndex_0 );

		face.normal.set( polygonNormal[ 0 ], polygonNormal[ 1 ], polygonNormal[ 2 ] );

		face.vertexColors[ 2 ] = new THREE.Color( vertex_0[ 3 ] );
		face.vertexColors[ 1 ] = new THREE.Color( vertex_1[ 3 ] );
		face.vertexColors[ 0 ] = new THREE.Color( vertex_2[ 3 ] );

		faces.push( face );

	}

	var mesh = this.regionMap[ identifier ] = new THREE.Mesh( geometry, material );
	mesh.position.set( position[ 0 ], position[ 1 ], position[ 2 ] );
	this.object3D.add( this.regionMap[ identifier ] );

};
