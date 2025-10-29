#include "../../shaders/baseVertex.glsl"

void main() {
    #include "../../shaders/normalMatrix.glsl"
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aPosition, 1.0);
}
