#version 300 es

uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uModelMatrix;

void main() {
    gl_Position = uProjectionMatrix * uViewMatrix * vec4(aPosition, 1.0);
}