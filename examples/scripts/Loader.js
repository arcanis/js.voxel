var Loader = function ( ) {

    this.weight = 0;

    this.tasks = [ ];

};

Loader.prototype.push = function ( driver ) {

    var driverArguments = Array.prototype.slice.call( arguments, 1 );
    var constructor = Function.prototype.bind.apply( driver, [ this ].concat( driverArguments ) );

    var task = new constructor( );
    this.weight += task.weight;
    this.tasks.push( task );

    return this;

};

Loader.prototype.start = function ( callback ) {

    var data = Object.create( null );

    var remainingWeight = this.weight;

    var currentTask = null;

    var next = function ( subProgress ) {

        if ( typeof subProgress === 'undefined' )
            subProgress = 1;

        var currentWeight = remainingWeight - ( currentTask ? currentTask.weight : 0 ) * subProgress;
        var progress = ( 1 - currentWeight / this.weight );

        callback( progress, data );

        if ( subProgress === 1 )
            remainingWeight = currentWeight;

        if ( subProgress === 1 && progress !== 1 ) {
            currentTask = this.tasks.shift( );
            currentTask.start( data, next );
        }

    }.bind( this );

    next( );

    return this;

};
