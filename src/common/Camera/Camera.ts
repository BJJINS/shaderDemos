type CameraType = "orthographic" | "perspective";

class Camera {
  type: String;
  constructor(type: CameraType) {
    this.type = type;
  }
}

export default Camera;