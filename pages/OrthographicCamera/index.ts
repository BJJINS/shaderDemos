import OrthographicCamera from "../common/Camera/Orthographic";
import Cube from "../common/Cube";
import World from "../common/World";

const world = new World();
const camera = new OrthographicCamera(world.canvas.width, world.canvas.height, 200); // 存储相机实例
const cube = new Cube({
  width: 1,
  height: 1,
  depth: 1,
});

const render = () => {
  cube.render();

  requestAnimationFrame(render);
};

render();
