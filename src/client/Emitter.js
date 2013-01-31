var VOXEL = VOXEL || Object.create( null );

VOXEL.Emitter = ( function ( ) {

    var fwd = function ( fn ) {
        return function ( _, selector ) {

            var fwdArguments = arguments;

            selector.split( / +/g ).forEach( function ( name ) {
                fwdArguments[ 1 ] = name;
                fn.apply( fwd, fwdArguments );
            }, this );

            return this;

        };
    };

    var on = fwd( function ( callbacks, name, fn, context ) {

        if ( ! callbacks[ name ] )
            throw new Error( 'Invalid event "' + name + '"' );

        callbacks[ name ].push( [ fn, context || this, false ] );

        return this;

    } );

    var off = fwd( function ( callbacks, name, fn, context ) {

        if ( ! callbacks[ name ] )
            throw new Error( 'Invalid event "' + name + '"' );

        callbacks[ name ] = callbacks[ name ].filter( function ( descriptor ) {
            return descriptor[ 0 ] !== fn || descriptor[ 1 ] !== context;
        } );

    } );

    var once = fwd( function ( callbacks, name, fn, context ) {

        if ( ! callbacks[ name ] )
            throw new Error( 'Invalid event "' + name + '"' );

        callbacks[ name ].push( [ fn, context || this, true ] );

    } );

    var trigger = fwd( function ( callbacks, name ) {

        if ( ! callbacks[ name ] )
            throw new Error( 'Invalid event "' + name + '"' );

        var fwdArguments = Array.prototype.slice.call( arguments, 2 );

        callbacks[ name ] = callbacks[ name ].filter( function ( descriptor ) {
            descriptor[ 0 ].apply( descriptor[ 1 ], fwdArguments );
            return descriptor[ 2 ] === false;
        } );

    } );

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
