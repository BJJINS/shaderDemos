import OrthographicCamera from "../common/Camera/Orthographic";
import Cube from "../common/Cube";
import { Vec3 } from "../common/Vector";
import World from "../common/World";

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
camera.position.z = 2;

camera.lookAt(new Vec3(0, 0, -1));


const cube = new Cube({
  width: 0.5,
  height: 0.5,
  depth: 0.5,
});


world.add(cube);

const render = () => {
  world.render();
  requestAnimationFrame(render);
};

render();
