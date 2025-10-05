#version 300 es

in  vec4 aPosition;
in  vec4 aColor;
out vec4 vColor;

uniform vec3 uTheta;

void main() {
    vec3 angles = radians( uTheta );
    vec3 c = cos( angles );
    vec3 s = sin( angles );

    mat4 rx = mat4( 
        1.0,  0.0,  0.0, 0.0,
        0.0,  c.x,  s.x, 0.0,
        0.0, -s.x,  c.x, 0.0,
        0.0,  0.0,  0.0, 1.0 
    );

    mat4 ry = mat4( 
        c.y, 0.0, -s.y, 0.0,
        0.0, 1.0,  0.0, 0.0,
        s.y, 0.0,  c.y, 0.0,
        0.0, 0.0,  0.0, 1.0 
    );


    mat4 rz = mat4( 
        c.z, s.z, 0.0, 0.0,
        -s.z,  c.z, 0.0, 0.0,
        0.0,  0.0, 1.0, 0.0,
        0.0,  0.0, 0.0, 1.0 
    );


    vColor = aColor;
    gl_Position = rz * ry * rx * aPosition;
    gl_Position.z = -gl_Position.z;
}
