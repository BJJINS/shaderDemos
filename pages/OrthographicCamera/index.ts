import Cube from "../common/Cube";
import World from "../common/World";

const world = new World();
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
