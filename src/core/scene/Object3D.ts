import Quaternion from "@core/math/Quaternion";
import Transformation from "@core/math/Transform";
import { Vec3 } from "@core/math/Vector";

abstract class Object3D {
  position = new Vec3();
  rotation = new Vec3();
  scale = new Vec3(1, 1, 1);
  children: Object3D[] = [];
  quaternion = new Quaternion();
  program!: WebGLProgram;
  viewMatrixUniformLoc!: WebGLUniformLocation;
  projectionMatrixUniformLoc!: WebGLUniformLocation;
  modelMatrixUniformLoc!: WebGLUniformLocation;

  vertices!: Float32Array;
  colors!: Float32Array;
  vao!: WebGLVertexArrayObject;
  constructor() {}
  add(child: Object3D) {
    this.children.push(child);
  }
  handleRotation() {
    const xMat4 = Transformation.rotationX(this.rotation.x);
    const yMat4 = Transformation.rotationY(this.rotation.y);
    const zMat4 = Transformation.rotationZ(this.rotation.z);
    return xMat4.mult(yMat4.mult(zMat4));
  }
  handlePosition() {
    const { x, y, z } = this.position;
    return Transformation.translate(x, y, z);
  }
  handleScale() {
    const { x, y, z } = this.scale;
    return Transformation.scale(x, y, z);
  }
  handleQuaternion() {
    return this.quaternion.toMatrix();
  }
  modelMatrix() {
    const rotationMatrix = this.handleRotation();
    const rotationQuaternionMatrix = this.handleQuaternion();
    const translateMatrix = this.handlePosition();
    const scaleMatrix = this.handleScale();
    return translateMatrix.mult(scaleMatrix.mult(rotationQuaternionMatrix.mult(rotationMatrix)));
  }
  abstract render(): void;
}

export default Object3D;
