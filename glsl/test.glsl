#version 300 es
precision mediump float;

uniform vec2 u_resolution;

out vec4 fragColor;

#define LINE_WIDTH 0.005
#define RED vec3(1.0,0.0,0.0)
#define BACKGROUND_COLOR vec3(0.0)
#define UV  2.0 * (gl_FragCoord.xy * 2.0 - u_resolution.xy) / u_resolution.y
#define CAMERA_VIEWPORT_DIS 1.0

vec2 perspectiveProjection(vec3 p) {
    return vec2(CAMERA_VIEWPORT_DIS * p.x / p.z, CAMERA_VIEWPORT_DIS * p.y / p.z);
}

// 平移
mat4 createTranslationMat(float x, float y, float z) {
    return mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        x, y, z, 1.0
    );
}

mat4 createScaleMat(float x, float y, float z) {
    return mat4(
        x, 0.0, 0.0, 0.0,
        0.0, y, 0.0, 0.0,
        0.0, 0.0, z, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
}

// 旋转
mat4 createRotationMat(float angle, vec3 axis) {
    float c = cos(angle);
    float s = sin(angle);
    float t = 1.0 - c;
    float x = axis.x;
    float y = axis.y;
    float z = axis.z;
    return mat4(
        t * x * x + c, t * x * y - z * s, t * x * z + y * s, 0.0,
        t * x * y + z * s, t * y * y + c, t * y * z - x * s, 0.0,
        t * x * z - y * s, t * y * z + x * s, t * z * z + c, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
}

vec3 drawLine(vec2 p0, vec2 p1, vec2 p, vec3 color) {
    float a = p1.y - p0.y;
    float b = -(p1.x - p0.x);
    float c = p1.x * p0.y - p0.x * p1.y;

    float lineLengthSquared = a * a + b * b;
    float dist = abs(a * p.x + b * p.y + c) / sqrt(lineLengthSquared);
    float dotProduct = dot(p - p0, p1 - p0);
    if (dotProduct >= 0.0 && dotProduct <= lineLengthSquared && dist < LINE_WIDTH / 2.0) {
        return color;
    }

    return BACKGROUND_COLOR;
}

vec3 drawTriangle(vec2 p0, vec2 p1, vec2 p2, vec2 p, vec3 color) {
    vec3 lineColor = drawLine(p0, p1, p, color);
    lineColor += drawLine(p1, p2, p, color);
    lineColor += drawLine(p0, p2, p, color);
    return lineColor;
}

vec3 drawCube(vec3 center, float size, mat4 transform, vec2 p) {
    mat4 translate = createTranslationMat(center.x, center.y, center.z);
    transform = translate * transform;
    vec4 vertexes[8] = vec4[8](
            // 前面四个顶点 (z较小)
            transform * vec4(-size, size, -size, 1.0), // 左上
            transform * vec4(size, size, -size, 1.0), // 右上
            transform * vec4(-size, -size, -size, 1.0), // 左下
            transform * vec4(size, -size, -size, 1.0), // 右下

            // 后面四个顶点 (z较大)
            transform * vec4(-size, size, size, 1.0), // 左上
            transform * vec4(size, size, size, 1.0), // 右上
            transform * vec4(-size, -size, size, 1.0), // 左下
            transform * vec4(size, -size, size, 1.0) // 右下
        );

    ivec3 triangles[12] = ivec3[12](
            ivec3(0, 1, 2), // 前面
            ivec3(1, 2, 3), // 前面
            ivec3(4, 5, 6), // 后面
            ivec3(5, 6, 7), // 后面
            ivec3(0, 4, 6), // 左面
            ivec3(0, 6, 2), // 左面
            ivec3(1, 5, 7), // 右面
            ivec3(1, 7, 3), // 右面
            ivec3(2, 3, 8), // 下面
            ivec3(2, 8, 6), // 下面
            ivec3(0, 1, 5), // 上面
            ivec3(0, 5, 4) // 上面
        );
    vec3 cubeColor = BACKGROUND_COLOR;
    for (int i = 0; i < triangles.length(); i++) {
        ivec3 t = triangles[i];
        vec3 p0 = vertexes[t.x].xyz;
        vec3 p1 = vertexes[t.y].xyz;
        vec3 p2 = vertexes[t.z].xyz;
        vec2 p0_2d = perspectiveProjection(p0);
        vec2 p1_2d = perspectiveProjection(p1);
        vec2 p2_2d = perspectiveProjection(p2);
        cubeColor += drawTriangle(p0_2d, p1_2d, p2_2d, p, RED);
    }
    return cubeColor;
}

void main() {
    vec3 color = drawCube(vec3(0.0, 0.0, 8.0), 2.0,  createRotationMat(radians(3.0), vec3(0.0, 1.0, 0.0)), UV);
    fragColor = vec4(color, 1.0);
}
