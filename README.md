# JS.Voxel

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

### new VOXEL.VoxelEngine( )

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
