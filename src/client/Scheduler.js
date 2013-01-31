var VOXEL = VOXEL || Object.create( null );

VOXEL.Scheduler = ( function ( ) {

    var getWorkerURL = ( function ( ) {

        var workerURL = null;

        return function ( ) {

            if ( workerURL === null )
                workerURL = ( window.URL || window.webkitURL )
                    .createObjectURL( new Blob( [ VOXEL.Scheduler.workerScript ] ) );

            return workerURL;
        };

    } )( );

    var Scheduler = function ( workerCount ) {

        VOXEL.Emitter( this )
            .addEventType( 'taskQueued' )
            .addEventType( 'taskSent' )
            .addEventType( 'taskCompleted' );

        this.tasks = [ ];

        this.workers = Object.create( null );
        this.availableWorkers = [ ];

        for ( var t = 0; t < workerCount; ++ t ) {
            this.workers[ t ] = { instance : new Worker( getWorkerURL( ) ), task : null };
            this.workers[ t ].instance.onmessage = this.listener.bind( this, t, null );
            this.workers[ t ].instance.onerror = this.listener.bind( this, t );
            this.availableWorkers.push( t );
        }

    };

    Scheduler.prototype.listener = function ( id, err, event ) {

        if ( err ) throw new Error( 'Worker error : ' + err.message );

        this[ '_' + event.data.command ]( id, event.data.data );

    };

    Scheduler.prototype.queue = function ( task ) {

        this.tasks.push( task );

        this.trigger( 'taskQueued', new VOXEL.Scheduler.TaskQueuedEvent( task ) );

        this.dequeue( );

    };

    Scheduler.prototype.dequeue = function ( ) {

        if ( ! this.tasks.length || ! this.availableWorkers.length )
            return ;

        var task = this.tasks.shift( );
        var workerId = this.availableWorkers.shift( );
        var worker = this.workers[ workerId ];

        worker.task = task;
        worker.instance.postMessage( task.data, task.transfers );

        this.trigger( 'taskSent', new VOXEL.Scheduler.TaskSentEvent( task ) );

    };

    Scheduler.prototype._complete = function ( id, data ) {

        var task = this.workers[ id ].task;
        this.workers[ id ].task = null;

        this.availableWorkers.push( id );

        this.trigger( 'taskCompleted', new VOXEL.Scheduler.TaskCompletedEvent( task, data ) );

        this.dequeue( );

    };

    Scheduler.prototype._log = function ( id, data ) {

        console.log.apply( console, [ 'Worker #' + id ].concat( data ) );

    };

    Scheduler.TaskQueuedEvent = function ( task ) {

        this.task = task;

    };

    Scheduler.TaskSentEvent = function ( task ) {

        this.task = task;

    };

    Scheduler.TaskCompletedEvent = function ( task, data ) {

        this.task = task;

        this.data = data;

    };

    return Scheduler;

} )( );
