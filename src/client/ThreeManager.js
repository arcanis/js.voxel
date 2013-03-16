var VOXEL = VOXEL || Object.create( null );

VOXEL.ThreeManager = ( function ( ) {

    var ThreeManager = function ( engine, materials ) {

        this.engine = null;
        this.materials = materials;

        this.object3D = new THREE.Object3D( );
        this.regions = Object.create( null );

        this.attach( engine );

    };

    ThreeManager.prototype.attach = function ( engine ) {

        if ( this.engine !== null )
            throw new Error( 'Cannot attach multiple voxel engine into a single manager' );

        this.engine = engine;
        this.engine.on( 'regionPolygonized', this.polygonizationHandler, this );

        return this;

    };

    ThreeManager.prototype.detach = function ( ) {

        if ( this.engine === null )
            throw new Error( 'No voxel engine attached' );

        this.engine.off( 'regionPolygonized', this.polygonizationHandler, this );
        this.engine = null;

        return this;

    };

    ThreeManager.prototype.polygonizationHandler = function ( event ) {

        var regionKey = event.regionKey
          , region = event.region
          , polygons = event.polygons;

        if ( this.regions[ regionKey ] )
            this.object3D.remove( this.regions[ regionKey ] );

        if ( ! polygons.length )
            return ;

        var vertexIndexCache = Object.create( null );

        var geometry = new THREE.Geometry( );
        var material = new THREE.MeshFaceMaterial( this.materials );

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
            face.vertexNormals.push( face.normal.clone( ), face.normal.clone( ), face.normal.clone( ) );

            face.materialIndex = polygonVertexes.sort( function ( a, b ) {
                return a[ 1 ] > b[ 1 ];
            } )[ 0 ][ 3 ] & VOXEL.MaterialBits;

            geometry.faces.push( face );
            geometry.faceVertexUvs[ 0 ].push( [
                new THREE.Vector2( 0, 0 ),
                new THREE.Vector2( 0, 1 ),
                new THREE.Vector2( 1, 0 )
            ] );

        }

        var mesh = this.regions[ regionKey ] = new THREE.Mesh( geometry, material );
        mesh.position.set( regionKey[ 0 ] * REGION_WIDTH, regionKey[ 1 ] * REGION_HEIGHT, regionKey[ 2 ] * REGION_DEPTH );
        this.object3D.add( this.regions[ regionKey ] );

    };

    return ThreeManager;

} )( );
