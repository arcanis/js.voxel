# JS.Voxel

> **Warning :** This library is not updated anymore ! The reason for this is that voxel world management (generation and polygonization) requires workers and thread pools to achieve good performances. Since I don't want to put a dedicated thread pool into the library, I have decided that it was less painful (including for the final developers - you) to write the voxel management system in the application (rather than in a library).
>
> *You can find the current up-to-date implementation of the js.voxel functionalities in the [Voxplode](https://github.com/arcanis/voxplode/) repository. It uses the [SWAT](http://arcanis.github.io/swat/) framework to efficiently manage workers.*

## Installation

### Precompiled library

You can use the up-to-date Voxel.js in the `build` folder ([here](http://github.com/arcanis/js.voxel/blob/master/build/Voxel.js)).

### Build it yourself

**Warning :** This is a web-only package : it is not meant to be used in a Node environment.

```
$> git clone git@github.com:arcanis/js.voxel
$> cd js.voxel
$> npm install
$> npm run-script build
```

## Usage

### new VOXEL.Engine( )

Returns a new engine instance.

--

### [instance].set( x, y, z, value )
Set a single voxel value.

--

### [instance].prepare( model )
Prepare a model to be used by the engine.

Returns a value called an handle, which identify the model in the engine.

You can find an example for loading models [here](http://arcanis.github.com/js.voxel/examples/binvox_loader.html).

### [instance].apply( handle, ... )
Apply a model on the engine. The parameters depends on the model type.

### [instance].release( handle )
Allows the engine to release resources used by the model.

--

### [instance].commit( )
Process every stored operations.
If you never call this method, there won't be any operation applied on the engine.

### [instance].rollback( )
Cancel every uncommited operations.

## Example

You can see examples in the `examples` directory ([here](http://github.com/arcanis/js.voxel/tree/master/examples/)).

## Author

Implementation by Maël Nison.

## See also

[Perlin.js](http://github.com/arcanis/js.perlin)
