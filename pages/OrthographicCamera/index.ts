import OrthographicCamera from "../common/Camera/Orthographic";
import Cube from "../common/Cube";
import { Vec3 } from "../common/Vector";
import World from "../common/World";

const world = new World();
const camera = new OrthographicCamera();
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;

camera.lookAt(new Vec3(0, 0, -1));

const cube = new Cube({
  width: 0.2,
  height: 0.2,
  depth: 0.2,
});

let angle = 0;

const render = () => {
  cube.render();
  angle += 2;
  // cube.rotateY(angle);
  cube.rotateX(angle);
  // cube.rotateZ(angle);

  requestAnimationFrame(render);
};

render();
