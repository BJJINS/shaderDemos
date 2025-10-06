import { OrthographicCamera } from "../common/Camera";
import Cube from "../common/Cube";
import World from "../common/World";

const world = new World();
const orthographicCamera = new OrthographicCamera(world.canvas.width, world.canvas.height, 20);
const cube = new Cube({
  width: 1,
  height: 1,
  depth: 1,
});


const render = () => {
  cube.render();
  requestAnimationFrame(render);
}


render();