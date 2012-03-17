define( [ 'three', 'voxel/tool/inheritor', 'text!voxel/extra/three/asset/vertexShader.gl', 'text!voxel/extra/three/asset/fragmentShader.gl' ], function ( Three, inheritor, vertexShader, fragmentShader ) {
	
	var Material = inheritor( Three.ShaderMaterial, function ( ) {
		
		Three.ShaderMaterial.call( this, {
			
			uniforms : { },
			attributes : { aColor : { type : 'c', value : [ ] } },
			
			vertexShader : vertexShader,
			fragmentShader : fragmentShader,
			
			wireframe : false
			
		} );
		
	} );
	
	return Material;
	
} );
