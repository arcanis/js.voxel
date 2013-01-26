var VOXEL=Object.create(null);VOXEL.ThreeManager=function(){this.object3D=new THREE.Object3D,this.regionMap=Object.create(null)},VOXEL.ThreeManager.prototype.onUpdateCommand=function(e,o){var r=e.join("/");if(this.regionMap[r]===void 0&&this.object3D.remove(this.regionMap[r]),o.length){for(var t=Object.create(null),n=new THREE.Geometry,a=new THREE.MeshLambertMaterial({vertexColors:THREE.VertexColors,shading:THREE.FlatShading}),i=n.vertices,s=n.faces,l=0,p=o.length;p>l;++l){var c=o[l],h=c[0],u=c[1],d=h[0],E=h[1],v=h[2],m=d[0]+"/"+d[1]+"/"+d[2],w=E[0]+"/"+E[1]+"/"+E[2],V=v[0]+"/"+v[1]+"/"+v[2],f=t[m]!==void 0?t[m]:t[m]=i.push(new THREE.Vector3(d[0],d[1],d[2]))-1,g=t[w]!==void 0?t[w]:t[w]=i.push(new THREE.Vector3(E[0],E[1],E[2]))-1,L=t[V]!==void 0?t[V]:t[V]=i.push(new THREE.Vector3(v[0],v[1],v[2]))-1,b=new THREE.Face3(L,g,f);b.normal.set(u[0],u[1],u[2]),b.vertexColors[2]=new THREE.Color(d[3]),b.vertexColors[1]=new THREE.Color(E[3]),b.vertexColors[0]=new THREE.Color(v[3]),s.push(b)}var x=this.regionMap[r]=new THREE.Mesh(n,a);x.position.set(e[0],e[1],e[2]),this.object3D.add(this.regionMap[r])}},VOXEL.BinvoxLoader=function(e,o){var r=new XMLHttpRequest;r.onload=function(){o(VOXEL.BinvoxLoader.parse(r.responseText))},r.open("GET",e,!0),r.overrideMimeType("text/plain; charset=x-user-defined"),r.send(null)},VOXEL.BinvoxLoader.format=/^#binvox 1\ndim ([0-9]*[1-9][0-9]*) (?:\1) (?:\1)\ntranslate (-?(?:[0-9]+(?:\.[0-9]*)?|[0-9]*\.[0-9]+)) (-?(?:[0-9]+(?:\.[0-9]*)?|[0-9]*\.[0-9]+)) (-?(?:[0-9]+(?:\.[0-9]*)?|[0-9]*\.[0-9]+))\nscale ([1-9][0-9]*(?:\.[0-9]*)?|0*\.[0-9]*[1-9][0-9]*)\ndata\n((?:[\S\s]{2})*)$/,VOXEL.BinvoxLoader.parse=function(e){var o=e.match(VOXEL.BinvoxLoader.format);if(!o)throw Error("Syntax error");for(var r=0,t=Number(o[1]),n=[Number(o[2]),Number(o[3]),Number(o[4])],a=Number(o[5]),i=o[6],s=[],l=0,p=i.length;p>l;l+=2){var c=255&i.charCodeAt(l),h=255&i.charCodeAt(l+1);if(-1===[0,1].indexOf(c)||1>h||h>255)throw Error("Invalid value : "+c+", "+h);c&&s.push([r,r+h]),r+=h}var u=Math.pow(t,3);if(r!==u)throw Error("Bad voxel count (found "+r+", expected "+u+")");return{type:"binvox",size:t,translation:n,scale:a,ranges:s}},VOXEL.CreateWorker=function(){var e=null,o=function(){return window.URL?window.URL:window.webkitURL?window.webkitURL:null},r=function(){if(null===e){var r=new Blob([VOXEL.CreateWorker.dataScript]);return e=o().createObjectURL(r)}return e};return function(){return new Worker(r())}}(),VOXEL.VoxelEngine=function(e){this.modelId=0,this.callbackId=0,this.callbacks={},this.worker=VOXEL.CreateWorker(),this.manager=e,this.operations=[],this.worker.onerror=this.error.bind(this),this.worker.onmessage=this.receive.bind(this)},VOXEL.VoxelEngine.prototype.set=function(e,o,r,t){this.operations.push({type:"set",value:t,x:e,y:o,z:r})},VOXEL.VoxelEngine.prototype.prepare=function(e){var o=this.modelId++;return this.operations.push({type:"prepare",id:o,model:e}),o},VOXEL.VoxelEngine.prototype.apply=function(e){var o=Array.prototype.slice.call(arguments,0);o.shift(),this.operations.push({type:"apply",id:e,arguments:o})},VOXEL.VoxelEngine.prototype.release=function(e){this.operations.push({type:"release",id:e})},VOXEL.VoxelEngine.prototype.rollback=function(){this.operations=[]},VOXEL.VoxelEngine.prototype.commit=function(e){var o=e?this.callbackId++:null;e&&(this.callbacks[o]=e),this.worker.postMessage({command:"commit",operations:this.operations,callbackId:o}),this.operations=[]},VOXEL.VoxelEngine.prototype.receive=function(e){var o=e.data;switch(o.command){case"update":this.manager.onUpdateCommand(o.update.position,o.update.polygons),null!==o.callbackId&&this.callbacks[o.callbackId]({update:o.update,progress:o.progress})}},VOXEL.VoxelEngine.prototype.error=function(e){console.log(e)};VOXEL.CreateWorker.dataScript = "var VOXEL=Object.create(null);VOXEL.Tables={vertexOffsets:[[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]],edgeConnections:[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]],edgeDirections:[[1,0,0],[0,1,0],[-1,0,0],[0,-1,0],[1,0,0],[0,1,0],[-1,0,0],[0,-1,0],[0,0,1],[0,0,1],[0,0,1],[0,0,1]],edgeFlagMap:[0,265,515,778,1030,1295,1541,1804,2060,2309,2575,2822,3082,3331,3593,3840,400,153,915,666,1430,1183,1941,1692,2460,2197,2975,2710,3482,3219,3993,3728,560,825,51,314,1590,1855,1077,1340,2620,2869,2111,2358,3642,3891,3129,3376,928,681,419,170,1958,1711,1445,1196,2988,2725,2479,2214,4010,3747,3497,3232,1120,1385,1635,1898,102,367,613,876,3180,3429,3695,3942,2154,2403,2665,2912,1520,1273,2035,1786,502,255,1013,764,3580,3317,4095,3830,2554,2291,3065,2800,1616,1881,1107,1370,598,863,85,348,3676,3925,3167,3414,2650,2899,2137,2384,1984,1737,1475,1226,966,719,453,204,4044,3781,3535,3270,3018,2755,2505,2240,2240,2505,2755,3018,3270,3535,3781,4044,204,453,719,966,1226,1475,1737,1984,2384,2137,2899,2650,3414,3167,3925,3676,348,85,863,598,1370,1107,1881,1616,2800,3065,2291,2554,3830,4095,3317,3580,764,1013,255,502,1786,2035,1273,1520,2912,2665,2403,2154,3942,3695,3429,3180,876,613,367,102,1898,1635,1385,1120,3232,3497,3747,4010,2214,2479,2725,2988,1196,1445,1711,1958,170,419,681,928,3376,3129,3891,3642,2358,2111,2869,2620,1340,1077,1855,1590,314,51,825,560,3728,3993,3219,3482,2710,2975,2197,2460,1692,1941,1183,1430,666,915,153,400,3840,3593,3331,3082,2822,2575,2309,2060,1804,1541,1295,1030,778,515,265,0],triangleConnections:[[],[0,8,3],[0,1,9],[1,8,3,9,8,1],[1,2,10],[0,8,3,1,2,10],[9,2,10,0,2,9],[2,8,3,2,10,8,10,9,8],[3,11,2],[0,11,2,8,11,0],[1,9,0,2,3,11],[1,11,2,1,9,11,9,8,11],[3,10,1,11,10,3],[0,10,1,0,8,10,8,11,10],[3,9,0,3,11,9,11,10,9],[9,8,10,10,8,11],[4,7,8],[4,3,0,7,3,4],[0,1,9,8,4,7],[4,1,9,4,7,1,7,3,1],[1,2,10,8,4,7],[3,4,7,3,0,4,1,2,10],[9,2,10,9,0,2,8,4,7],[2,10,9,2,9,7,2,7,3,7,9,4],[8,4,7,3,11,2],[11,4,7,11,2,4,2,0,4],[9,0,1,8,4,7,2,3,11],[4,7,11,9,4,11,9,11,2,9,2,1],[3,10,1,3,11,10,7,8,4],[1,11,10,1,4,11,1,0,4,7,11,4],[4,7,8,9,0,11,9,11,10,11,0,3],[4,7,11,4,11,9,9,11,10],[9,5,4],[9,5,4,0,8,3],[0,5,4,1,5,0],[8,5,4,8,3,5,3,1,5],[1,2,10,9,5,4],[3,0,8,1,2,10,4,9,5],[5,2,10,5,4,2,4,0,2],[2,10,5,3,2,5,3,5,4,3,4,8],[9,5,4,2,3,11],[0,11,2,0,8,11,4,9,5],[0,5,4,0,1,5,2,3,11],[2,1,5,2,5,8,2,8,11,4,8,5],[10,3,11,10,1,3,9,5,4],[4,9,5,0,8,1,8,10,1,8,11,10],[5,4,0,5,0,11,5,11,10,11,0,3],[5,4,8,5,8,10,10,8,11],[9,7,8,5,7,9],[9,3,0,9,5,3,5,7,3],[0,7,8,0,1,7,1,5,7],[1,5,3,3,5,7],[9,7,8,9,5,7,10,1,2],[10,1,2,9,5,0,5,3,0,5,7,3],[8,0,2,8,2,5,8,5,7,10,5,2],[2,10,5,2,5,3,3,5,7],[7,9,5,7,8,9,3,11,2],[9,5,7,9,7,2,9,2,0,2,7,11],[2,3,11,0,1,8,1,7,8,1,5,7],[11,2,1,11,1,7,7,1,5],[9,5,8,8,5,7,10,1,3,10,3,11],[5,7,0,5,0,9,7,11,0,1,0,10,11,10,0],[11,10,0,11,0,3,10,5,0,8,0,7,5,7,0],[11,10,5,7,11,5],[10,6,5],[0,8,3,5,10,6],[9,0,1,5,10,6],[1,8,3,1,9,8,5,10,6],[1,6,5,2,6,1],[1,6,5,1,2,6,3,0,8],[9,6,5,9,0,6,0,2,6],[5,9,8,5,8,2,5,2,6,3,2,8],[2,3,11,10,6,5],[11,0,8,11,2,0,10,6,5],[0,1,9,2,3,11,5,10,6],[5,10,6,1,9,2,9,11,2,9,8,11],[6,3,11,6,5,3,5,1,3],[0,8,11,0,11,5,0,5,1,5,11,6],[3,11,6,0,3,6,0,6,5,0,5,9],[6,5,9,6,9,11,11,9,8],[5,10,6,4,7,8],[4,3,0,4,7,3,6,5,10],[1,9,0,5,10,6,8,4,7],[10,6,5,1,9,7,1,7,3,7,9,4],[6,1,2,6,5,1,4,7,8],[1,2,5,5,2,6,3,0,4,3,4,7],[8,4,7,9,0,5,0,6,5,0,2,6],[7,3,9,7,9,4,3,2,9,5,9,6,2,6,9],[3,11,2,7,8,4,10,6,5],[5,10,6,4,7,2,4,2,0,2,7,11],[0,1,9,4,7,8,2,3,11,5,10,6],[9,2,1,9,11,2,9,4,11,7,11,4,5,10,6],[8,4,7,3,11,5,3,5,1,5,11,6],[5,1,11,5,11,6,1,0,11,7,11,4,0,4,11],[0,5,9,0,6,5,0,3,6,11,6,3,8,4,7],[6,5,9,6,9,11,4,7,9,7,11,9],[10,4,9,6,4,10],[4,10,6,4,9,10,0,8,3],[10,0,1,10,6,0,6,4,0],[8,3,1,8,1,6,8,6,4,6,1,10],[1,4,9,1,2,4,2,6,4],[3,0,8,1,2,9,2,4,9,2,6,4],[0,2,4,4,2,6],[8,3,2,8,2,4,4,2,6],[10,4,9,10,6,4,11,2,3],[0,8,2,2,8,11,4,9,10,4,10,6],[3,11,2,0,1,6,0,6,4,6,1,10],[6,4,1,6,1,10,4,8,1,2,1,11,8,11,1],[9,6,4,9,3,6,9,1,3,11,6,3],[8,11,1,8,1,0,11,6,1,9,1,4,6,4,1],[3,11,6,3,6,0,0,6,4],[6,4,8,11,6,8],[7,10,6,7,8,10,8,9,10],[0,7,3,0,10,7,0,9,10,6,7,10],[10,6,7,1,10,7,1,7,8,1,8,0],[10,6,7,10,7,1,1,7,3],[1,2,6,1,6,8,1,8,9,8,6,7],[2,6,9,2,9,1,6,7,9,0,9,3,7,3,9],[7,8,0,7,0,6,6,0,2],[7,3,2,6,7,2],[2,3,11,10,6,8,10,8,9,8,6,7],[2,0,7,2,7,11,0,9,7,6,7,10,9,10,7],[1,8,0,1,7,8,1,10,7,6,7,10,2,3,11],[11,2,1,11,1,7,10,6,1,6,7,1],[8,9,6,8,6,7,9,1,6,11,6,3,1,3,6],[0,9,1,11,6,7],[7,8,0,7,0,6,3,11,0,11,6,0],[7,11,6],[7,6,11],[3,0,8,11,7,6],[0,1,9,11,7,6],[8,1,9,8,3,1,11,7,6],[10,1,2,6,11,7],[1,2,10,3,0,8,6,11,7],[2,9,0,2,10,9,6,11,7],[6,11,7,2,10,3,10,8,3,10,9,8],[7,2,3,6,2,7],[7,0,8,7,6,0,6,2,0],[2,7,6,2,3,7,0,1,9],[1,6,2,1,8,6,1,9,8,8,7,6],[10,7,6,10,1,7,1,3,7],[10,7,6,1,7,10,1,8,7,1,0,8],[0,3,7,0,7,10,0,10,9,6,10,7],[7,6,10,7,10,8,8,10,9],[6,8,4,11,8,6],[3,6,11,3,0,6,0,4,6],[8,6,11,8,4,6,9,0,1],[9,4,6,9,6,3,9,3,1,11,3,6],[6,8,4,6,11,8,2,10,1],[1,2,10,3,0,11,0,6,11,0,4,6],[4,11,8,4,6,11,0,2,9,2,10,9],[10,9,3,10,3,2,9,4,3,11,3,6,4,6,3],[8,2,3,8,4,2,4,6,2],[0,4,2,4,6,2],[1,9,0,2,3,4,2,4,6,4,3,8],[1,9,4,1,4,2,2,4,6],[8,1,3,8,6,1,8,4,6,6,10,1],[10,1,0,10,0,6,6,0,4],[4,6,3,4,3,8,6,10,3,0,3,9,10,9,3],[10,9,4,6,10,4],[4,9,5,7,6,11],[0,8,3,4,9,5,11,7,6],[5,0,1,5,4,0,7,6,11],[11,7,6,8,3,4,3,5,4,3,1,5],[9,5,4,10,1,2,7,6,11],[6,11,7,1,2,10,0,8,3,4,9,5],[7,6,11,5,4,10,4,2,10,4,0,2],[3,4,8,3,5,4,3,2,5,10,5,2,11,7,6],[7,2,3,7,6,2,5,4,9],[9,5,4,0,8,6,0,6,2,6,8,7],[3,6,2,3,7,6,1,5,0,5,4,0],[6,2,8,6,8,7,2,1,8,4,8,5,1,5,8],[9,5,4,10,1,6,1,7,6,1,3,7],[1,6,10,1,7,6,1,0,7,8,7,0,9,5,4],[4,0,10,4,10,5,0,3,10,6,10,7,3,7,10],[7,6,10,7,10,8,5,4,10,4,8,10],[6,9,5,6,11,9,11,8,9],[3,6,11,0,6,3,0,5,6,0,9,5],[0,11,8,0,5,11,0,1,5,5,6,11],[6,11,3,6,3,5,5,3,1],[1,2,10,9,5,11,9,11,8,11,5,6],[0,11,3,0,6,11,0,9,6,5,6,9,1,2,10],[11,8,5,11,5,6,8,0,5,10,5,2,0,2,5],[6,11,3,6,3,5,2,10,3,10,5,3],[5,8,9,5,2,8,5,6,2,3,8,2],[9,5,6,9,6,0,0,6,2],[1,5,8,1,8,0,5,6,8,3,8,2,6,2,8],[1,5,6,2,1,6],[1,3,6,1,6,10,3,8,6,5,6,9,8,9,6],[10,1,0,10,0,6,9,5,0,5,6,0],[0,3,8,5,6,10],[10,5,6],[11,5,10,7,5,11],[11,5,10,11,7,5,8,3,0],[5,11,7,5,10,11,1,9,0],[10,7,5,10,11,7,9,8,1,8,3,1],[11,1,2,11,7,1,7,5,1],[0,8,3,1,2,7,1,7,5,7,2,11],[9,7,5,9,2,7,9,0,2,2,11,7],[7,5,2,7,2,11,5,9,2,3,2,8,9,8,2],[2,5,10,2,3,5,3,7,5],[8,2,0,8,5,2,8,7,5,10,2,5],[9,0,1,5,10,3,5,3,7,3,10,2],[9,8,2,9,2,1,8,7,2,10,2,5,7,5,2],[1,3,5,3,7,5],[0,8,7,0,7,1,1,7,5],[9,0,3,9,3,5,5,3,7],[9,8,7,5,9,7],[5,8,4,5,10,8,10,11,8],[5,0,4,5,11,0,5,10,11,11,3,0],[0,1,9,8,4,10,8,10,11,10,4,5],[10,11,4,10,4,5,11,3,4,9,4,1,3,1,4],[2,5,1,2,8,5,2,11,8,4,5,8],[0,4,11,0,11,3,4,5,11,2,11,1,5,1,11],[0,2,5,0,5,9,2,11,5,4,5,8,11,8,5],[9,4,5,2,11,3],[2,5,10,3,5,2,3,4,5,3,8,4],[5,10,2,5,2,4,4,2,0],[3,10,2,3,5,10,3,8,5,4,5,8,0,1,9],[5,10,2,5,2,4,1,9,2,9,4,2],[8,4,5,8,5,3,3,5,1],[0,4,5,1,0,5],[8,4,5,8,5,3,9,0,5,0,3,5],[9,4,5],[4,11,7,4,9,11,9,10,11],[0,8,3,4,9,7,9,11,7,9,10,11],[1,10,11,1,11,4,1,4,0,7,4,11],[3,1,4,3,4,8,1,10,4,7,4,11,10,11,4],[4,11,7,9,11,4,9,2,11,9,1,2],[9,7,4,9,11,7,9,1,11,2,11,1,0,8,3],[11,7,4,11,4,2,2,4,0],[11,7,4,11,4,2,8,3,4,3,2,4],[2,9,10,2,7,9,2,3,7,7,4,9],[9,10,7,9,7,4,10,2,7,8,7,0,2,0,7],[3,7,10,3,10,2,7,4,10,1,10,0,4,0,10],[1,10,2,8,7,4],[4,9,1,4,1,7,7,1,3],[4,9,1,4,1,7,0,8,1,8,7,1],[4,0,3,7,4,3],[4,8,7],[9,10,8,10,11,8],[3,0,9,3,9,11,11,9,10],[0,1,10,0,10,8,8,10,11],[3,1,10,11,3,10],[1,2,11,1,11,9,9,11,8],[3,0,9,3,9,11,1,2,9,2,11,9],[0,2,11,8,0,11],[3,2,11],[2,3,8,2,8,10,10,8,9],[9,10,2,0,9,2],[2,3,8,2,8,10,0,1,8,1,10,8],[1,10,2],[1,3,8,9,1,8],[0,9,1],[0,3,8],[]]},VOXEL.BinvoxBrush=function(e,o,t,n,r,i){for(var a=e.size,s=e.translation,p=e.scale,l=e.ranges,c=s[0]/p,h=s[1]/p,d=s[2]/p,u=0,g=l.length;g>u;++u)for(var E=l[u],f=E[0],v=E[1];v>f;++f){var O=Math.floor(f/a/a%a),V=Math.floor(f%a),L=Math.floor(f/a%a),m=Math.floor(t+c+O),b=Math.floor(n+h+V),X=Math.floor(r+d+L);o.set(m,b,X,i)}},VOXEL.Region=function(e,o,t,n){this.needsUpdate=!1,this.regionMap=e,this.voxelX=16*o,this.voxelY=16*t,this.voxelZ=16*n},VOXEL.Region.prototype.update=function(e){for(var o=this.regionMap.db,t=[],n=VOXEL.Tables.vertexOffsets,r=VOXEL.Tables.edgeConnections,i=VOXEL.Tables.edgeDirections,a=VOXEL.Tables.edgeFlagMap,s=VOXEL.Tables.triangleConnections,p=0,l=this.voxelX;16>p;++p,++l)for(var c=0,h=this.voxelY;16>c;++c,++h)for(var d=0,u=this.voxelZ;16>d;++d,++u){var g=[o[[l+0,h+0,u+0].join(\",\")]||4294967295,o[[l+1,h+0,u+0].join(\",\")]||4294967295,o[[l+1,h+1,u+0].join(\",\")]||4294967295,o[[l+0,h+1,u+0].join(\",\")]||4294967295,o[[l+0,h+0,u+1].join(\",\")]||4294967295,o[[l+1,h+0,u+1].join(\",\")]||4294967295,o[[l+1,h+1,u+1].join(\",\")]||4294967295,o[[l+0,h+1,u+1].join(\",\")]||4294967295],E=0|(4294967295!==g[0]?1:0)|(4294967295!==g[1]?2:0)|(4294967295!==g[2]?4:0)|(4294967295!==g[3]?8:0)|(4294967295!==g[4]?16:0)|(4294967295!==g[5]?32:0)|(4294967295!==g[6]?64:0)|(4294967295!==g[7]?128:0),f=a[E];if(0!==f){for(var v={},O=0;12>O;++O)if(f&1<<O){var V=r[O],L=i[O],m=n[V[0]];v[O]=[p+m[0]+L[0]/2,c+m[1]+L[1]/2,d+m[2]+L[2]/2,g[V[+(4294967295===g[V[0]])]]]}for(var b=s[E],X=0,x=b.length/3;x>X;++X){var y=v[b[3*X+0]],R=v[b[3*X+1]],M=v[b[3*X+2]],w=[R[0]-y[0],R[1]-y[1],R[2]-y[2]],C=[M[0]-y[0],M[1]-y[1],M[2]-y[2]],k=[w[1]*C[2]-w[2]*C[1],w[2]*C[0]-w[0]*C[2],w[0]*C[1]-w[1]*C[0]],T=Math.sqrt(Math.pow(k[0],2)+Math.pow(k[1],2)+Math.pow(k[2],2)),U=[-k[0]/T,-k[1]/T,-k[2]/T];t.push([[y,R,M],U])}}}e&&e.call(this,{position:[this.voxelX,this.voxelY,this.voxelZ],polygons:t})},VOXEL.RegionMap=function(e){this.db=e||Object.create(null),this.indexedRegions=Object.create(null),this.regionsNeedingUpdate=[]},VOXEL.RegionMap.prototype.prepareRegion=function(e,o,t){var n=16*16*t+16*o+e;return this.indexedRegions[n]||(this.indexedRegions[n]=new VOXEL.Region(this,e,o,t))},VOXEL.RegionMap.prototype.prepareRegionUpdate=function(e,o,t){var n=this.prepareRegion(e,o,t);n.needsUpdate||(this.regionsNeedingUpdate.push(n),n.needsUpdate=!0)},VOXEL.RegionMap.prototype.set=function(e,o,t,n){var r=Math.floor(e/16),i=Math.floor(o/16),a=Math.floor(t/16),s=0===e%16,p=0===o%16,l=0===t%16;this.prepareRegionUpdate(r,i,a),s&&this.prepareRegionUpdate(r-1,i,a),p&&this.prepareRegionUpdate(r,i-1,a),l&&this.prepareRegionUpdate(r,i,a-1),s&&p&&this.prepareRegionUpdate(r-1,i-1,a),s&&l&&this.prepareRegionUpdate(r-1,i,a-1),p&&l&&this.prepareRegionUpdate(r,i-1,a-1),s&&p&&l&&this.prepareRegionUpdate(r-1,i-1,a-1);var c=[e,o,t].join(\",\");this.db[c]=n},VOXEL.RegionMap.prototype.updateAll=function(e){for(var o=this.regionsNeedingUpdate,t=o.length,n=0;o.length;)o.shift().update(function(o){this.needsUpdate=!1,e&&e.call(this,{update:{position:o.position,polygons:o.polygons},progress:{total:t,success:++n}})})},VOXEL.Application=function(){this.models=Object.create(null),this.regionMap=new VOXEL.RegionMap},VOXEL.Application.prototype.onMessage=function(e){var o=e.data;switch(o.command){case\"commit\":this.onCommitCommand(o.operations,o.callbackId)}},VOXEL.Application.prototype.onCommitCommand=function(e,o){for(var t=0,n=e.length;n>t;++t){var r=e[t];switch(r.type){case\"set\":this.onSetOperation(r.x,r.y,r.z,r.value);break;case\"prepare\":this.onPrepareOperation(r.id,r.model);break;case\"apply\":this.onApplyOperation(r.id,r.arguments);break;case\"release\":this.onReleaseOperation(r.id)}}this.regionMap.updateAll(function(e){self.postMessage({command:\"update\",callbackId:o,update:e.update,progress:e.progress})})},VOXEL.Application.prototype.onSetOperation=function(e,o,t,n){this.regionMap.set(e,o,t,n)},VOXEL.Application.prototype.onPrepareOperation=function(e,o){this.models[e]=o},VOXEL.Application.prototype.onApplyOperation=function(e,o){var t=this.models[e],n=t.type.charAt(0).toUpperCase()+t.type.substr(1).toLowerCase()+\"Brush\";VOXEL[n].apply(null,[t,this.regionMap].concat(o))},VOXEL.Application.prototype.onReleaseOperation=function(e){delete this.models[e]},function(){var e=new VOXEL.Application;self.onmessage=e.onMessage.bind(e)}();";