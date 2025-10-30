export type ShaderIO = {
  vertex: string;
  fragment: string;
};

export type ShaderContext = {
  defines: Record<string, boolean>;
  normals?: Float32Array;
  material: { color: { x: number; y: number; z: number; w: number } };
};

export type ShaderProcessor = (io: ShaderIO, ctx: ShaderContext) => ShaderIO;

export class ShaderPipeline {
  private processors: ShaderProcessor[] = [];

  use(processor: ShaderProcessor) {
    this.processors.push(processor);
    return this;
  }

  run(io: ShaderIO, ctx: ShaderContext): ShaderIO {
    return this.processors.reduce((acc, p) => p(acc, ctx), io);
  }
}

const applyShaderDefines: ShaderProcessor = (io, ctx) => {
  ctx.defines.normal = !!ctx.normals;

  const keys = Object.keys(ctx.defines);
  let str = "";
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i] as keyof typeof ctx.defines;
    if (ctx.defines[key]) {
      str += `#define ${String(key).toUpperCase()}\n`;
    }
  }
  return {
    ...io,
    vertex: io.vertex.replace("{{ defines }}", str),
  };
};

const applyMaterialColor: ShaderProcessor = (io, ctx) => {
  const { x, y, z, w } = ctx.material.color;
  return {
    ...io,
    fragment: io.fragment.replace("{{ color }}", `vec4(${x}, ${y}, ${z}, ${w})`),
  };
};

export const withDefaultObject3DProcessors = () => {
  const pipeline = new ShaderPipeline();
  return pipeline.use(applyShaderDefines).use(applyMaterialColor);
};
