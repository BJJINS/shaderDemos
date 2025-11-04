interface CreateSceneOptions {
  canvas?: HTMLCanvasElement;
}

const createScene = (options?: CreateSceneOptions) => {
  const { gl, canvas } = initializeWebgl2({
    canvas: options?.canvas,
  });
};
