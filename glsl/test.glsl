#version 300 es
precision mediump float;

uniform vec2 u_resolution;

out vec4 fragColor;

#define LINE_WIDTH 0.001
#define RED vec3(1.0,0.0,0.0)
#define BACKGROUND_COLOR vec3(0.0)
#define UV (gl_FragCoord.xy * 2.0 - u_resolution.xy) / u_resolution.y
#default CAMERA_VIEWPORT_DIS 1.0

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

vec2 perspectiveProjection(vec3 p) {
    return vec2(CAMERA_VIEWPORT_DIS * p.x / p.z, CAMERA_VIEWPORT_DIS * p.y / p.z);
}

void main() {
    vec3 color = drawTriangle(vec2(-0.2, 0.2), vec2(0.2), vec2(0.2, -0.2), UV, RED);
    fragColor = vec4(color, 1.0);
}
