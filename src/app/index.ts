import PerspectiveCamera from "@core/camera/Perspective";
import World from "@core/gl/World";
import { Vec3 } from "@core/math/Vector";
import PointLight from "@core/scene/Light/PointLight";
import Cube from "@objects/Cube";
import Plane from "@objects/Plane";
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

const cube = new Cube({
  width: 1,
  height: 1,
  depth: 1,
});

cube.position.x = 3;

const sphere = new TetrahedronSphere({
  radius: 1,
});

// world.addObjects(cube);
// world.addObjects(sphere);

const plane = new Plane({
  width: 3,
});
world.addObjects(plane);

let angle = 0;

const render = () => {
  angle += 0.5;
  // cube.rotation.x = angle;
  // cube.rotation.y = angle;

  // sphere.rotation.x = angle;
  // sphere.rotation.y = angle;
  world.render();
  requestAnimationFrame(render);
};

render();
