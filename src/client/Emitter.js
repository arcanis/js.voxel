var VOXEL = VOXEL || Object.create( null );

VOXEL.Emitter = ( function ( ) {

    var on = function ( callbacks, name, fn, context ) {

        if ( ! callbacks[ name ] )
            throw new Error( 'Invalid event "' + name + '"' );

        callbacks[ name ].push( [ fn, context || this, false ] );

        return this;

    };

    var off = function ( callbacks, name, fn, context ) {

        if ( ! callbacks[ name ] )
            throw new Error( 'Invalid event "' + name + '"' );

        callbacks[ name ] = callbacks[ name ].filter( function ( descriptor ) {
            return descriptor[ 0 ] !== fn || descriptor[ 1 ] !== context;
        } );

        return this;

    };

    var once = function ( callbacks, name, fn, context ) {

        if ( ! callbacks[ name ] )
            throw new Error( 'Invalid event "' + name + '"' );

        callbacks[ name ].push( [ fn, context || this, true ] );

        return this;

    };

    var trigger = function ( callbacks, name ) {

        if ( ! callbacks[ name ] )
            return this;

        var fwdArguments = Array.prototype.slice.call( arguments, 2 );

        callbacks[ name ] = callbacks[ name ].filter( function ( descriptor ) {
            descriptor[ 0 ].apply( descriptor[ 1 ], fwdArguments );
            return descriptor[ 2 ] === false;
        } );

        return this;

    };

    return function ( instance ) {

        var callbacks = Object.create( null );

        instance.on = on.bind( instance, callbacks );
        instance.off = off.bind( instance, callbacks );
        instance.once = once.bind( instance, callbacks );
        instance.trigger = trigger.bind( instance, callbacks );

        return {
            addEventType : function ( name ) {
                callbacks[ name ] = [ ];
                return this;
            }
        };

    };

} )( );
