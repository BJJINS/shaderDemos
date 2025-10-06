import { OrthographicCamera } from "../common/Camera";
import Cube from "../common/Cube";
import World from "../common/World";

const world = new World();
new OrthographicCamera(world.canvas.width, world.canvas.height, 200);
const cube = new Cube({
  width: 10,
  height: 10,
  depth: 10,
});

const render = () => {
  cube.render();
  requestAnimationFrame(render);
};

render();
