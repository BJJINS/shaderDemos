import OrthographicCamera from "../common/Camera/Orthographic";
import Cube from "../common/Cube";
import World from "../common/World";

const world = new World();
const camera = new OrthographicCamera(world.canvas.width, world.canvas.height, 200); // 存储相机实例
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
  // cube.rotateX(angle);
  cube.rotateZ(angle);

  requestAnimationFrame(render);
};

render();
