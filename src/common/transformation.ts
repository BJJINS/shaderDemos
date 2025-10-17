import { Mat4 } from "./Matrix";

const scale = (x = 1, y = 1, z = 1) => {
  return new Mat4([
    x, 0, 0, 0, 
    0, y, 0, 0, 
    0, 0, z, 0, 
    0, 0, 0, 1
  ]);
};

 const translate = (x = 0, y = 0, z = 0) => {
  return new Mat4([
    1, 0, 0, x, 
    0, 1, 0, y, 
    0, 0, 1, z, 
    0, 0, 0, 1
  ])
}

const rotationX = (degrees: number) => {
   const radians = degrees / 180 * Math.PI;
   const c = Math.cos(radians);
   const s = Math.sin(radians);
    return new Mat4([
        1, 0, 0, 0,
        0, c, -s,0,
        0, s, c, 0,
        0, 0, 0, 1
    ]); 
}


const rotationY = (degrees: number) => {
   const radians = degrees / 180 * Math.PI;
   const c = Math.cos(radians);
   const s = Math.sin(radians);
    return new Mat4([
        c, 0, s, 0,
        0, 1, 0, 0,
        -s,0, c, 0,
        0, 0, 0, 1
    ]); 
}

const rotationZ = (degrees: number) => {
   const radians = degrees / 180 * Math.PI;
   const c = Math.cos(radians);
   const s = Math.sin(radians);
    return new Mat4([
        c, -s, 0, 0,
        s,  c, 0, 0,
        0,  0, 1, 0,
        0,  0, 0, 1
    ]); 
}



const Transformation = {
  scale,
  translate,
  rotationX,
  rotationY,
  rotationZ
};
export default Transformation;