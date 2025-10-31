#version 300 es
precision mediump float;

{ { defines } }

out vec4 fragColor;

#ifdef NORMAL
in vec3 vNormal;
#endif

vec4 color =  { { color } };

void main() {
    fragColor = color; 
}
