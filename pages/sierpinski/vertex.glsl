#version 300 es

in vec3 aColor;
in vec3 aPosition;

out vec3 vColor;

void main() {
    gl_Position = vec4(aPosition,1.0);
    vColor = aColor;
}
