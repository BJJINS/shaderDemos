import PerspectiveCamera from "@core/camera/Perspective";
import World from "@core/gl/World";
import { Vec3 } from "@core/math/Vector";
import PointLight from "@core/scene/Light/PointLight";
import Cube from "@objects/Cube";
import TetrahedronSphere from "@objects/Sphere/TetrahedronSphere";

const world = new World({
  light: new PointLight(),
});
const aspect = window.innerWidth / window.innerHeight;
const near = 1;
const far = 100;

const camera = new PerspectiveCamera(45, aspect, near, far);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 10;

camera.lookAt(new Vec3(0, 0, 0));

const grid = 5;
const spacing = 1.5;
const count = grid * grid;
const instanceMatrices = new Float32Array(count * 16);
let idx = 0;
for (let y = 0; y < grid; y++) {
  for (let x = 0; x < grid; x++) {
    const tx = (x - (grid-1) / 2) * spacing;
    const ty = (y - (grid-1) / 2) * spacing;
    const tz = 0;
    const base = idx * 16;
    instanceMatrices[base + 0] = 1;  instanceMatrices[base + 1] = 0;  instanceMatrices[base + 2] = 0;  instanceMatrices[base + 3] = 0;
    instanceMatrices[base + 4] = 0;  instanceMatrices[base + 5] = 1;  instanceMatrices[base + 6] = 0;  instanceMatrices[base + 7] = 0;
    instanceMatrices[base + 8] = 0;  instanceMatrices[base + 9] = 0;  instanceMatrices[base +10] = 1;  instanceMatrices[base +11] = 0;
    instanceMatrices[base +12] = tx; instanceMatrices[base +13] = ty; instanceMatrices[base +14] = tz; instanceMatrices[base +15] = 1;
    idx++;
  }
}

const cube = new Cube({
  width: 0.8,
  height: 0.8,
  depth: 0.8,
  // instanceMatrices,
  // instanceCount: count,
  // wireframe: true,
});

const sphere = new TetrahedronSphere({
  radius: 2,
  subdivisions: 8,

});

world.addObjects(cube);
// world.addObjects(sphere);

let angle = 0;

const render = () => {
  angle += 0.5;
  cube.rotation.x = angle;
  cube.rotation.y = angle;
  world.render();
  requestAnimationFrame(render);
};

render();
