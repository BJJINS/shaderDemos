import "./style.css";
import initWebGL2 from "./js/util.js";
import MatrixState from "./js/MatrixState.js";
const gl = initWebGL2();

const ms = new MatrixState();
ms.setInitStack();
