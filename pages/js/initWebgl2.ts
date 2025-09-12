import "../style.css";

interface Options {
  clearColor?: [number, number, number, number];
}

const initWebGL2 = (options: Options = {}) => {
  const { clearColor = [1.0, 0.0, 0.0, 1.0] } = options;
  const canvas = document.createElement("canvas");
  const pixelRatio = window.devicePixelRatio;
  // 设备像素比最大是2
  const ratio = pixelRatio > 1 ? 2 : 1;
  const gl = canvas.getContext("webgl2", {
    // 开启抗锯齿 当像素比是1的时候
    antialias: ratio < 2,
  });
  if (!gl) {
    throw new Error("WebGL not supported");
  }
  //开启深度检测
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(...clearColor);
  // 设备像素比大于1的时候 画布的宽度和高度要乘以设备像素比
  const setGl = () => {
    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
  };

  setGl();
  canvas.setAttribute("style", "position: absolute; top: 0; left: 0;");
  document.body.appendChild(canvas);
  window.addEventListener("resize", setGl);
  return gl;
};

export default initWebGL2;
