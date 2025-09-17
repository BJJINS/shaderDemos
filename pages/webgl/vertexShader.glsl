#version 300 es

in vec2 a_position;
in vec3 a_color;

uniform vec2 u_resolution;

out vec3 v_color;

void main() {
    v_color = a_color;
    gl_Position = vec4(a_position / u_resolution * vec2(2, -2) + vec2(-1, 1), 0, 1);
}
