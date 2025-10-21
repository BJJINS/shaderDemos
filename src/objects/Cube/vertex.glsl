#version 300 es

in vec4 aPosition;
in vec3 aColor;

uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uModelMatrix;

out vec3 vColor;

// quaternion multiplier
vec4 mult_q(vec4 a, vec4 b) {
    return (vec4(a.x * b.x - dot(a.yzw, b.yzw), a.x * b.yzw + b.x * a.yzw + cross(b.yzw, a.yzw)));
}

// inverse quaternion
vec4 inv_q(vec4 a) {
    return (vec4(a.x, -a.yzw) / dot(a, a));
}

void main() {
    vColor = aColor;
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * aPosition;
}
