define( [ 'three', 'voxel/tool/inheritor', 'voxel/tool/optor', 'voxel/extra/three/region', 'voxel/engine' ], function ( Three, inheritor, optor, Region, Base ) {
	
	var Engine = inheritor( Base, function ( helper, options ) {
		
		this.helper = helper;
		
		Base.call( this, optor( options, {
			
			regionClass : Region
			
		} ) );
		
	} );
	
	Engine.prototype.onRegionUpdateStart = function ( region ) {
		
		this.helper.remove( region.mesh );
		
	};
	
	Engine.prototype.onRegionUpdateEnd = function ( region ) {
		
		this.helper.add( region.mesh );
		
	};
	
	return Engine;
	
} );
