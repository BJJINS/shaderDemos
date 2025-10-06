#version 300 es

in vec4 aPosition;
in vec3 aColor;

uniform mat4 uProjectionMatrix;

out vec3 vColor;

void main() {
    vColor = aColor;
    vec4 position = uProjectionMatrix * aPosition;
    gl_Position = position;
}
