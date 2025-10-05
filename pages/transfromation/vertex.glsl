#version 300 es

in vec4 aColor;
in vec4 aPosition;

out vec4 vColor;

void main() {
    vColor = aColor;
    gl_Position = aPosition;
}
