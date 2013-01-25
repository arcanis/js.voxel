VOXEL.VoxelEngine = function ( managerClass ) {

    this.modelId = 0;

    this.callbackId = 0;
    this.callbacks = { };

    this.worker = VOXEL.CreateWorker( );
    this.manager = managerClass;
    this.operations = [ ];

    this.worker.onerror = this.error.bind( this );
    this.worker.onmessage = this.receive.bind( this );

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

VOXEL.VoxelEngine.prototype.commit = function ( callback ) {

    var callbackId = callback ? this.callbackId ++ : null;
    if ( callback ) this.callbacks[ callbackId ] = callback;

    this.worker.postMessage( {
        command : 'commit',
        operations : this.operations,
        callbackId : callbackId
    } );

    this.operations = [ ];

};

VOXEL.VoxelEngine.prototype.receive = function ( event ) {

    var message = event.data;

    switch ( message.command ) {

        case 'update':
            this.manager.onUpdateCommand( message.update.position, message.update.polygons );
            message.callbackId !== null && this.callbacks[ message.callbackId ]( {
                update : message.update,
                progress : message.progress
            } );
        break ;

    }

};

VOXEL.VoxelEngine.prototype.error = function ( error ) {

    console.log( error );

};
