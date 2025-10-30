import PerspectiveCamera from "@core/camera/Perspective";
import World from "@core/gl/World";
import { Vec3 } from "@core/math/Vector";
import PointLight from "@core/scene/Light/PointLight";
import Cube from "@objects/Cube";

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

const cube = new Cube({
  width: 1,
  height: 1,
  depth: 1,
  wireframe: true,
});

cube.rotation.y = 45;

world.addObjects(cube);
world.addLights(new PointLight());


let angle = 0;

const zAxis = new Vec3(1, 0, 1);

  cube.quaternion.setAxisDegrees(zAxis, angle);
//   cube2.quaternion.setAxisDegrees(zAxis, angle);
//   sphere.quaternion.setAxisDegrees(new Vec3(1, 0, 0), angle);



const render = () => {
  angle += 1;
  cube.quaternion.setAxisDegrees(zAxis, angle);
  world.render();
  requestAnimationFrame(render);
};

render();
