define( [ 'three', 'voxel/tool/inheritor', 'voxel/tool/optor', 'voxel/extra/three/region', 'voxel/engine' ], function ( Three, inheritor, optor, Region, Base ) {
	
	var Engine = inheritor( Base, function ( helper, options ) {
		
		this.helper = helper;
		
		this.materials = [ ];
		
		Base.call( this, optor( options, {
			
			regionClass : Region
			
		} ) );
		
	} );
	
	Engine.prototype.onRegionCreate = function ( region ) {
		
		Base.prototype.onRegionCreate.call( this, region );
		
		region.geometry.materials = this.materials;
		
		this.helper.add( region.mesh );
		
	};
	
	Engine.prototype.onRegionRemove = function ( region ) {
		
		Base.prototype.onRegionRemove.call( this, region  );
		
		this.helper.remove( region.mesh );
		
	};
	
	return Engine;
	
} );
