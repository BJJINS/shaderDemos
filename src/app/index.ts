import Cube from "@objects/Cube";
import { Vec3, Vec4 } from "@core/math/Vector";
import World from "@core/gl/World";
import PerspectiveCamera from "@core/camera/Perspective";
import TetrahedronSphere from "@objects/Sphere/TetrahedronSphere";

const world = new World({
});
const aspect = window.innerWidth / window.innerHeight;
const near = 1;
const far = 100;

const camera = new PerspectiveCamera(45, aspect, near, far);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 10;

camera.lookAt(new Vec3(0, 0, 0));

// const cube = new Cube({
//   width: 1,
//   height: 1,
//   depth: 1,
// });

// cube.rotation.y = 45;

// const cube2 = new Cube({
//   width: 1,
//   height: 1,
//   depth: 3,
//   wireframe: true,
// });

const sphere = new TetrahedronSphere({
  radius: 1,
  subdivisions: 5,
  // wireframe: true,
});

// 第二个立方体：向左平移，便于区分
// cube2.position.x = -3;

// world.add(cube);
// world.add(cube2);
world.add(sphere);

let angle = 0;

// const zAxis = new Vec3(1, 0, 1);

//   cube.quaternion.setAxisDegrees(zAxis, angle);
//   cube2.quaternion.setAxisDegrees(zAxis, angle);
//   sphere.quaternion.setAxisDegrees(new Vec3(1, 0, 0), angle);

const render = () => {
  angle += 1;
  sphere.quaternion.setAxisDegrees(new Vec3(1, 1, 0), angle);
  world.render();
  requestAnimationFrame(render);
};

render();
