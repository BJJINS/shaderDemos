#version 300 es
precision mediump float;

out vec4 fragColor;
in vec3 vColor;

#ifdef NORMAL
in vec3 vNormal;
#endif

void main() {
    fragColor = vec4(vColor, 1.0);
}
