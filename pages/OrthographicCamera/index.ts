import Cube from "../common/Cube";
import global from "../common/global";
import World from "../common/World";

const world = new World();
const cube = new Cube({
  width: 0.2,
  height: 0.2,
  depth: 0.2,
});

const render = () => {
  global.gl.clear(global.gl.COLOR_BUFFER_BIT | global.gl.DEPTH_BUFFER_BIT);
  cube.render();
  requestAnimationFrame(render);
};

render();
