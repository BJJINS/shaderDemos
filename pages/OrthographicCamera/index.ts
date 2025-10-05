import Cube from "../common/Cube";
import World from "../common/World";

const world = new World();
const cube = new Cube({
  gl: world.gl,
  width: 1,
  height: 1,
  depth: 1,
});


const render = () => {
  cube.render();
  requestAnimationFrame(render);
}


render();