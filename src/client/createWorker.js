var VOXEL = VOXEL || Object.create( null );

VOXEL.createWorker = ( function ( ) {

    var workerURL = null;

    var getWindowURL = function ( ) {

        if ( window.URL ) {

            return window.URL;

        } else if ( window.webkitURL ) {

            return window.webkitURL;

        } else {

            return null;

        }

    };

    var getWorkerURL = function ( ) {

        if ( workerURL === null ) {

            var blob = new Blob( [ VOXEL.createWorker.dataScript ] );

            workerURL = getWindowURL( ).createObjectURL( blob );

            return workerURL;

        } else {

            return workerURL;

        }

    };

    return function ( ) {

        return new Worker( getWorkerURL( ) );

    };

} ( ) );
