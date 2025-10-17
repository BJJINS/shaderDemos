import Transformation from "./transformation";

abstract class Object3D {
  position: [number, number, number] = [0, 0, 0];
  rotation: [number, number, number] = [0, 0, 0]; // [x, y, z] in angle
  children: Object3D[] = [];
  constructor() {}
  add(child: Object3D) {
    this.children.push(child);
  }
  initialRotation() {
    const xMat4 = Transformation.rotationX(this.rotation[0]);
    const yMat4 = Transformation.rotationY(this.rotation[1]);
    const zMat4 = Transformation.rotationZ(this.rotation[2]);
    return xMat4.mult(yMat4.mult(zMat4));
  }
  rotateY(angle: number) {
    this.rotation[1] = angle;
  }
  rotateX(angle: number) {
    this.rotation[0] = angle;
  }
  rotateZ(angle: number) {
    this.rotation[2] = angle;
  }
  abstract render(): void;
}

export default Object3D;
