var VOXEL = VOXEL || Object.create( null );

VOXEL.NOP = 0xffffffff;
VOXEL.L0  = 0 << 24;
VOXEL.L1  = 1 << 24;
VOXEL.L2  = 2 << 24;
VOXEL.L3  = 3 << 24;
VOXEL.L4  = 4 << 24;
VOXEL.L5  = 5 << 24;
VOXEL.L6  = 6 << 24;
VOXEL.L7  = 7 << 24;
VOXEL.L8  = 8 << 24;
VOXEL.L9  = 9 << 24;
VOXEL.LayerBits = 0xff << 24;
VOXEL.MaterialBits = ~ VOXEL.LayerBits;
