#version 300 es

in vec3 aPosition;
in vec3 aColor;

out vec3 vColor;

void main() {
    vColor = aColor;
    gl_Position = vec4(aPosition.x, aPosition.y, aPosition.z - 1.0, 1.0);
}
