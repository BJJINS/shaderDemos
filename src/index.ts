import OrthographicCamera from "./common/Camera/Orthographic";
import Cube from "./common/Cube";
import { Vec3 } from "./common/Vector";
import World from "./common/World";

const world = new World();
const aspect = window.innerWidth / window.innerHeight;
const top = 5;
const bottom = -top;
const left = -top * aspect;
const right = -left;
const near = 1;
const far = 10;

const camera = new OrthographicCamera(left, right, bottom, top, near, far);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 4;

camera.lookAt(new Vec3(0, 0, 0));

const cube = new Cube({
  width: 1,
  height: 1,
  depth: 1,
});

// cube.rotation.y = -90;

cube.quaternion.setAxisDegrees(new Vec3(0,1,0), 45)

world.add(cube);


const render = () => {
  world.render();
  requestAnimationFrame(render);
};

render();
