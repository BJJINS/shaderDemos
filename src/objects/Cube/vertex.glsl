#include "../../shaders/baseVertex.glsl"

void main() {
    gl_Position = uProjectionMatrix * uViewMatrix * MODEL_MATRIX * vec4(aPosition, 1.0);
}
