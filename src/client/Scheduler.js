var VOXEL = VOXEL || Object.create( null );

VOXEL.Scheduler = function ( workerCount, callback ) {

    this.tasks = [ ];
    this.callback = callback;

    this.workers = Object.create( null );
    this.availableWorkers = [ ];

    for ( var t = 0; t < workerCount; ++ t ) {
        this.workers[ t ] = { instance : VOXEL.Scheduler.createWorker( ), task : null };
        this.workers[ t ].instance.onmessage = this.listener.bind( this, t, null );
        this.workers[ t ].instance.onerror = this.listener.bind( this, t );
        this.availableWorkers.push( t );
    }

};

VOXEL.Scheduler.createWorker = ( function ( ) {

    var blob = new Blob( [ VOXEL.Scheduler.workerScript ] );

    var workerURL = ( window.URL || window.webkitURL ).createObjectURL( blob );

    return function ( ) { return new Worker( workerURL ); };

} )( );

VOXEL.Scheduler.prototype.listener = function ( id, err, data ) {

    if ( err )
        throw err;

    this[ '_' + data.command ]( id, data );

};

VOXEL.Scheduler.prototype.queue = function ( task ) {

    this.tasks.push( task );

    this.dequeue( );

};

VOXEL.Scheduler.prototype.dequeue = function ( ) {

    if ( ! this.queue.length || ! this.availableWorkers.length )
        return ;

    var task = this.queue.shift( );
    var workerId = this.availableWorkers.shift( );
    var worker = this.workers[ workerId ];

    worker.task = task;
    worker.instance.postMessage( task.data, task.transfers );

    task.launch( );

};

VOXEL.Scheduler.prototype[ '_complete' ] = function ( id, data ) {

    var task = this.workers[ id ].task;
    this.workers[ id ].task = null;

    this.availableWorkers.push( id );

    task.complete( data );
    this.callback( task, data );

    this.dequeue( );

};

VOXEL.Scheduler.prototype[ '_log' ] = function ( id, data ) {

    console.log.apply( console, [ 'Worker #' + id ].concat( data.parameters ) );

};
