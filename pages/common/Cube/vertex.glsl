#version 300 es

{{DEFINES}}

in vec4 aPosition;
in vec3 aColor;

uniform vec3 uRotation;

out vec3 vColor;

void rotation() {
    vec3 angles = radians(uRotation);
    vec3 c = cos(angles);
    vec3 s = sin(angles);
    mat4 rx = mat4(1.0, 0.0, 0.0, 0.0,
            0.0, c.x, s.x, 0.0,
            0.0, -s.x, c.x, 0.0,
            0.0, 0.0, 0.0, 1.0);

    mat4 ry = mat4(c.y, 0.0, -s.y, 0.0,
            0.0, 1.0, 0.0, 0.0,
            s.y, 0.0, c.y, 0.0,
            0.0, 0.0, 0.0, 1.0);

    mat4 rz = mat4(c.z, s.z, 0.0, 0.0,
            -s.z, c.z, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0);

    gl_Position = rz * ry * rx * aPosition;
}

// quaternion multiplier
vec4 mult_q(vec4 a, vec4 b) {
    return (vec4(a.x * b.x - dot(a.yzw, b.yzw), a.x * b.yzw + b.x * a.yzw + cross(b.yzw, a.yzw)));
}

// inverse quaternion
vec4 inv_q(vec4 a) {
    return (vec4(a.x, -a.yzw) / dot(a, a));
}
void rotation_quaternion() {
    vec3 angles = radians(uRotation);
    vec4 p;
    vec3 c = cos(angles / 2.0);
    vec3 s = sin(angles / 2.0);
    vec4 rx = vec4(c.x, s.x, 0.0, 0.0); // x 轴旋转
    vec4 ry = vec4(c.y, 0.0, s.y, 0.0); // y 轴旋转
    vec4 rz = vec4(c.z, 0.0, 0.0, s.z); // z 轴旋转
    vec4 r = mult_q(rx, mult_q(ry, rz));
    p = vec4(0.0, aPosition.xyz); // input point quaternion
    p = mult_q(r, mult_q(p, inv_q(r))); // rotated point quaternion
    gl_Position = vec4(p.yzw, 1.0); // convert back to homogeneous coordinates
}


void main() {
    vColor = aColor;
    #ifdef ENABLE_QUATERNION
    rotation_quaternion();
    #else
    rotation();
    #endif

    // gl_Position = aPosition;
}
