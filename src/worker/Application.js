var VOXEL = VOXEL || Object.create( null );

VOXEL.Application = function ( ) {

    this.models = Object.create( null );

    this.regionMap = new VOXEL.RegionMap( );

};

VOXEL.Application.prototype.onMessage = function ( event ) {

    var message = event.data;

    switch ( message.command ) {

        case 'commit':
            this.onCommitCommand( message.operations, message.callbackId );
        break ;

    }

};

VOXEL.Application.prototype.onCommitCommand = function ( operations, callbackId ) {

    for ( var t = 0, T = operations.length; t < T; ++ t ) {

        var operation = operations[ t ];

        switch ( operation.type ) {

            case 'set':
                this.onSetOperation( operation.x, operation.y, operation.z, operation.value );
            break ;

            case 'prepare':
                this.onPrepareOperation( operation.id, operation.model );
            break ;

            case 'apply':
                this.onApplyOperation( operation.id, operation.arguments );
            break ;

            case 'release':
                this.onReleaseOperation( operation.id );
            break ;

        }

    }

    this.regionMap.updateAll( function ( infos ) {

        self.postMessage( {

            command : 'update',

            callbackId : callbackId,

            update : infos.update,
            progress : infos.progress

        } );

    } );

};

VOXEL.Application.prototype.onSetOperation = function ( voxelX, voxelY, voxelZ, value ) {

    this.regionMap.set( voxelX, voxelY, voxelZ, value );

};

VOXEL.Application.prototype.onPrepareOperation = function ( id, model ) {

    this.models[ id ] = model;

};

VOXEL.Application.prototype.onApplyOperation = function ( id, arguments ) {

    var model = this.models[ id ];

    var type = model.type.charAt( 0 ).toUpperCase( ) + model.type.substr( 1 ).toLowerCase( );

    VOXEL.Brush[ type ].apply( null, [ model, this.regionMap ].concat( arguments ) );

};

VOXEL.Application.prototype.onReleaseOperation = function ( id ) {

    delete this.models[ id ];

};
