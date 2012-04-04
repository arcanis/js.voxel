Voxel.js
========

This library allows you to have a voxel engine in your application.

It's currently a draft, so please feel free to contribute. I will look every pull request.

Dependencies
------------

This library uses [RequireJS](http://requirejs.org/) as dependency. I'm sorry if you don't know how to use it, or don't want to. Feel free to open an issue to discuss about this topic if you really think it could be useful to use the library as standalone.

VoxelJS is bundled with an extra pack for [ThreeJS](http://mrdoob.github.com/three.js/). It's optional, but using this bundle allow you to start your project without having to implement all of the rendering process, which could be tricky.

Usage
-----

### Main API

#### Engine

##### Methods
 * *get(int, int, int)* : Returns the value of the given voxel, or `null`.
 * *set(int, int, int, mixed)* : Set the value of the given voxel, set the adjacent regions dirty flags.
 * *update()* : Generate every dirty regions.

##### User callbacks
 * *onRegionCreate(region)* : Called when a region is created.
 * *onRegionRemove(region)* : Called when a region is removed.
 * *onRegionUpdateStart(region)* : Called before region update.
 * *onRegionUpdateEnd(region)* : Called after region update.

#### Region

##### Attributes
 * *position* : Array of the region position (unit is region).
 * *dimensions* : Array of the region dimensions (unit is voxel).

##### User callbacks
 * *onVoxel(voxel)* : Called once for every voxel of the generated mesh.
 * *onTriangle(array<voxel>)* : Called once for every three voxels.
 * *onUpdateStart()* : Called before region update.
 * *onUpdateEnd()* : Called after region update.

### Three.js extra bundle

#### Helper

You can use this class as every others three.js objects.

 * *getVoxel(Three.Vector3)* : Get the value of the given voxel.
 * *setVoxel(Three.Vector3, mixed)* : Set the value of the given voxel.
 * *update()* : Updates the mesh with the last voxels changes.

Todo
----

 * Applying a uniform coding style + cleaning code
 * Improving performances (but I don't really know how to do, any idea ?)
 * Implementing a naive minecraft-like processing algorithm
 * More helpers for more libraries
 * Native WebGL implementation
 * *Waiting for feedbacks : )*
