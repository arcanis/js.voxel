VOXEL.CreateWorker = ( function ( ) {

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

			var GenericBlobBuilder = null;

			if ( window.BlobBuilder )
				GenericBlobBuilder = window.BlobBuilder;
			else if ( window.WebKitBlobBuilder )
				GenericBlobBuilder = window.WebKitBlobBuilder;
			else if ( window.MozBlobBuilder )
				GenericBlobBuilder = window.MozBlobBuilder;
			else
				GenericBlobBuilder = false;

			var blobBuilder = new GenericBlobBuilder( );
			blobBuilder.append( VOXEL.CreateWorker.dataScript );

			var blob = blobBuilder.getBlob( );

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
