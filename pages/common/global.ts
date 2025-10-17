interface Global {
  gl?: WebGL2RenderingContext;
}

const global: Global = {};

export const getGL=()=>{
  if (!global.gl) {
    throw new Error("webgl2 not initialized");
  }
  return global.gl;
}

export default global;
