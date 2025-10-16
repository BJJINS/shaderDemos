import Cube from "../common/Cube";
import World from "../common/World";

const world = new World();
const cube = new Cube({
  width: 0.2,
  height: 0.2,
  depth: 0.2,
});

world.add(cube);

let angle = 0;

const render = () => {
  cube.rotateY(angle+=1);
  world.render();
  requestAnimationFrame(render);
};

render();
