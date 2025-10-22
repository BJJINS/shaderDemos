#version 300 es

in vec4 aPosition;
in vec3 aColor;

uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uModelMatrix;

out vec3 vColor;

void main() {
    vColor = aColor;
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aPosition;
}
