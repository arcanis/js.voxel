require( [ 'three', 'stats', 'voxel/extra/three/helper', 'voxel/extra/three/material', 'domReady!' ], function ( Three, Stats, VoxelHelper, VoxelMaterial ) {
	
	var stats = new Stats( );
	stats.getDomElement( ).style.position = 'absolute';
	stats.getDomElement( ).style.left = '0px';
	stats.getDomElement( ).style.top = '0px';
	document.body.appendChild( stats.getDomElement( ) );
	
	var renderer = new Three.WebGLRenderer( );
	document.body.appendChild( renderer.domElement );
	renderer.domElement.style.background = 'black';
	renderer.domElement.style.position = 'absolute';
	renderer.domElement.style.left = '0';
	renderer.domElement.style.top = '0';
	
	var camera = new Three.PerspectiveCamera( 60, 1, .01, 20000 );
	
	var pointLight = new Three.PointLight( 0xffffff );
	pointLight.position = camera.position;
	
	var ambientLight = new Three.AmbientLight( 0 );
	
	var voxelHelper = new VoxelHelper( 20 );
	voxelHelper.scale.set( 0.1, 0.1, 0.1 );
	voxelHelper.position.z = - 10;
	
	var scene = new Three.Scene( );
	scene.add( camera );
	scene.add( pointLight );
	scene.add( ambientLight );
	scene.add( voxelHelper );
	
	var clock = new Three.Clock( );
	
	var makeCube = function ( x, y, z, s ) {
		
		for ( var v = 0; v < s; ++ v ) {
			
			for ( var u = 0; u < s; ++ u ) {
				
				voxelHelper.setVoxel( new Three.Vector3( x + u, y + s - 1, z + v ), 0x57A84C );
				
				for ( var w = 0; w < s - 1; ++ w ) {
					
					voxelHelper.setVoxel( new Three.Vector3( x + u, y + w, z + v ), 0x9E7D4F );
					
				}
				
			}
			
		}
		
	};
	
	var parseImage = function ( url, fn ) {
		
		var img = new Image( );
		img.src = url;
		
		img.onload = function ( ) {
			
			var canvas = document.createElement( 'canvas' );
			
			canvas.width = img.width;
			canvas.height = img.height;
			
			var ctx = canvas.getContext( '2d' );
			
			ctx.drawImage( img, 0, 0 );
			
			var data = ctx.getImageData( 0, 0, canvas.width, canvas.height );
			
			fn( data );
			
		};
		
	};
	
	parseImage( "face.png", function ( faceBuffer ) {
		
		var data = faceBuffer.data;
		
		for ( var x = 0, xl = faceBuffer.width; x < xl; ++ x ) {
			
			for ( var y = 0, yl = faceBuffer.height; y < yl; ++ y ) {
				
				var index = ( ( y * xl ) + x ) * 4;
				
				var color = new Three.Color( );
				color.setRGB( data[ index + 0 ] / 255, data[ index + 1 ] / 255, data[ index + 2 ] / 255 );
				color = color.getHex( );
				
				voxelHelper.setVoxel( new Three.Vector3( x, yl - y - 1, 0 ), color );
					
			}
			
		}
		
		parseImage( "wall.png", function ( wallBuffer ) {
			
			var data = wallBuffer.data;
			
			for ( var x = 0, xl = wallBuffer.width; x < xl; ++ x ) {
				
				for ( var y = 0, yl = wallBuffer.height; y < yl; ++ y ) {
					
					var index = ( ( y * xl ) + x ) * 4;
					
					var color = new Three.Color( );
					color.setRGB( data[ index + 0 ] / 255, data[ index + 1 ] / 255, data[ index + 2 ] / 255 );
					color = color.getHex( );
					
					console.log( 0, yl - y - 1, - ( x + 1 ) );
					
					voxelHelper.setVoxel( new Three.Vector3( 0, yl - y - 1, - ( x + 1 ) ), color );
					
					voxelHelper.setVoxel( new Three.Vector3( faceBuffer.width - 1, yl - y - 1, - ( x + 1 ) ), color );
					
				}
				
			}
			
		} );
		
	} );
	
	window.addEventListener( 'resize', function ( ) {
		
		var resize = function ( ) {
			
			renderer.setSize( window.innerWidth, window.innerHeight );
			
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix( );
			
			return resize;
			
		};
		
		return resize( );
		
	}( ) );
	
	window.addEventListener( 'blur', function ( ) {
		
		clock.stop( );
		
	} );
	
	window.addEventListener( 'focus', function ( ) {
		
		clock.start( );
		
	} );
	
	window.requestLoop( function ( ) {
		
		var delta = clock.getDelta( );
		
		voxelHelper.rotation.y += Math.PI / 5 * delta;
		
	} );
	
	window.requestAnimationLoop( function ( ) {
		
		voxelHelper.update( );
		
		stats.update( );
		
		renderer.render( scene, camera );
		
	} );
	
} );
