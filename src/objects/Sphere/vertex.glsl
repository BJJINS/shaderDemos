#include "../../shaders/baseVertex.glsl"

void main() {
    #include "../../shaders/normalMatrix.glsl"
    gl_Position = uProjectionMatrix * uViewMatrix * MODEL_MATRIX * vec4(aPosition, 1.0);
}
