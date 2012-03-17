define( [ 'three', 'voxel/tool/inheritor', 'voxel/tool/optor', 'voxel/extra/three/engine' ], function ( Three, inheritor, optor, Engine ) {
	
	var Helper = inheritor( Three.Object3D, function ( ) {
		
		Three.Object3D.call( this );
		
		this.engine = new Engine( this );
		
	} );
	
	Helper.prototype.pushMaterial = function ( material ) {
		
		this.engine.materials.push( material );
		
	};
	
	Helper.prototype.setVoxel = function ( point, value ) {
		
		this.engine.set( point.x, point.y, point.z, value );
		
	};
	
	Helper.prototype.getVoxel = function ( point ) {
		
		return this.engine.get( point.x, point.y, point.z );
		
	};
	
	Helper.prototype.update = function ( ) {
		
		this.engine.update( );
		
	};
	
	return Helper;
	
} );
