abstract class Object3D {
  position: [number, number, number] = [0, 0, 0];
  rotation: [number, number, number] = [0, 0, 0]; // [x, y, z] in angle
  children: Object3D[] = [];
  constructor() {}
  add(child: Object3D) {
    this.children.push(child);
  }
  abstract render(): void;
}

export default Object3D;
