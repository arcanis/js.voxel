VOXEL.VoxelEngine = function ( managerClass ) {

	this.modelId = 0;

	this.worker = VOXEL.CreateWorker( );
	this.manager = managerClass;
	this.operations = [ ];

	this.worker.onerror = this.error.bind( this );
	this.worker.onmessage = this.receive.bind( this );

	this.worker.postMessage( {
		command : 'initialization',
		configuration : {
			region : [ 32, 128, 32 ],
			block : [ 16, 16, 16 ]
		}
	} );

};

VOXEL.VoxelEngine.prototype.set = function ( x, y, z, value ) {

	this.operations.push( {
		type : 'set',
		value : value,
		x : x,
		y : y,
		z : z
	} );

};

VOXEL.VoxelEngine.prototype.prepare = function ( model ) {

	var id = this.modelId ++;

	this.operations.push( {
		type : 'prepare',
		id : id,
		model : model
	} );

	return id;

};

VOXEL.VoxelEngine.prototype.apply = function ( id ) {

	var argumentsArray = Array.prototype.slice.call( arguments, 0 );
	argumentsArray.shift( );

	this.operations.push( {
		type : 'apply',
		id : id,
		arguments : argumentsArray
	} );

};

VOXEL.VoxelEngine.prototype.release = function ( id ) {

	this.operations.push( {
		type : 'release',
		id : id
	} );

};

VOXEL.VoxelEngine.prototype.rollback = function ( ) {

	this.operations = [ ];

};

VOXEL.VoxelEngine.prototype.commit = function ( ) {

	this.worker.postMessage( {
		command : 'commit',
		operations : this.operations
	} );

};

VOXEL.VoxelEngine.prototype.receive = function ( event ) {

	var message = event.data;

	switch ( message.command ) {

	case 'update':
		this.manager.onUpdateCommand( message.position, message.polygons );
		break ;

	}

};

VOXEL.VoxelEngine.prototype.error = function ( error ) {

	console.log( error );

};
