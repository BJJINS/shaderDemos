/// <reference types="vite/client" />

declare module "*.glsl" {
  const content: string;
  export default content;
}

interface Vec2 {
  x: number;
  y: number;
  type: "vec2";
}


interface Vec3 {
  x: number;
  y: number;
  z: number;
  type: "vec3";
}
