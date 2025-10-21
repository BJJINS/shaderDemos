import type Camera from "@core/camera/Camera";

interface Global {
  gl?: WebGL2RenderingContext;
  camera?: Camera;
}

const global: Global = {};

export const getGL = () => {
  if (!global.gl) {
    throw new Error("webgl2 not initialized");
  }
  return global.gl;
};

export const getCamera = () => {
  if (!global.camera) {
    throw new Error("camera not initialized");
  }
  return global.camera;
};

export default global;
