#version 300 es

in vec2 a_position;
in vec2 a_texcoord;

uniform vec2 u_resolution;

out vec3 v_color;
out vec2 v_texcoord;

void main() {
    v_texcoord = a_texcoord;
    gl_Position = vec4(a_position / u_resolution * vec2(2, -2) + vec2(-1, 1), 0, 1);
}
