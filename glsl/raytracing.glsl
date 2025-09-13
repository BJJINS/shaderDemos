#version 300 es
precision mediump float; // 为浮点数指定默认精度

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

out vec4 fragColor;
#include "light.glsl"

struct Sphere {
    vec3 center;
    float radius;
    vec3 color;
};

// 添加立方体结构体
struct Box {
    vec3 center;
    vec3 size;
    vec3 color;
};

vec3 lightColor = vec3(1.0);

Sphere spheres[2] = Sphere[2](
        Sphere(vec3(2.0, 0.0, -7.0), 1.0, vec3(.875, .286, .333)),
        Sphere(vec3(-2.0, 0.0, -7.0), 1.0, vec3(0.192, 0.439, 0.651))
    );

// 添加一个立方体
Box boxes[1] = Box[1](
        Box(vec3(-2.0, 2.0, -3.0), vec3(1.0, 1.0, 1.0), vec3(0.0, 0.0, 1.0)) // 一个蓝色立方体
    );

vec2 sphIntersect(in vec3 rayOrigin, in vec3 rayDirection, in Sphere sphere) {
    vec3 oc = rayOrigin - sphere.center;
    float b = dot(oc, rayDirection);
    float c = dot(oc, oc) - sphere.radius * sphere.radius;
    float h = b * b - c;
    if (h < 0.0) return vec2(-1.0); // no intersection
    h = sqrt(h);
    return vec2(-b - h, -b + h);
}

vec2 boxIntersection(in vec3 ro, in vec3 rd, vec3 boxSize, out vec3 outNormal) {
    vec3 m = 1.0 / rd;
    vec3 n = m * ro;
    vec3 k = abs(m) * boxSize;
    vec3 t1 = -n - k;
    vec3 t2 = -n + k;
    float tN = max(max(t1.x, t1.y), t1.z);
    float tF = min(min(t2.x, t2.y), t2.z);
    if (tN > tF || tF < 0.0) {
        return vec2(-1.0);
    }
    outNormal = (tN > 0.0) ? step(vec3(tN), t1) : step(t2, vec3(tF));
    outNormal *= -sign(rd);
    return vec2(tN, tF);
}

vec3 raytracing(in vec3 rayOrigin, in vec3 rayDirection) {
    float minT = 1.0;
    float maxT = 1000.0;
    float closest_t = 1000.0;
    vec3 color = vec3(0.0);
    for (int i = 0; i < 2; i++) {
        Sphere sphere = spheres[i];
        vec2 t = sphIntersect(rayOrigin, rayDirection, sphere);
        if (t.x < closest_t && minT < t.x && t.x < maxT) {
            closest_t = t.x;
            color += ambient(lightColor, 0.6);
            vec3 hitPoint = rayOrigin + rayDirection * t.x;
            vec3 normal = normalize(hitPoint - sphere.center);
            vec3 viewDirection = normalize(rayOrigin - hitPoint);
            color += pointLight(lightColor, 1.0, vec3(5.0, 20.0, 0.0), hitPoint, normal, viewDirection, 5.0, 0.01);
            // color += directionLight(lightColor, 1.0, normal, vec3(0.0, 0.0, 10.0), viewDirection, 5.0);

            color += specularLight(lightColor, 1.0, normal, viewDirection);

            color *= sphere.color;
        }
    }
    return color;
}

void main() {
    float aspect = u_resolution.x / u_resolution.y;

    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= aspect;
    float fov = 60.0; // 视角，单位为度
    float tanFov = tan(radians(fov) * 0.5);
    uv *= tanFov;

    // 计算正确的射线方向，考虑透视效果
    vec3 rayOrigin = vec3(0.0, 0.0, 0.0); // 将相机向后移动一些距离，以便更好地观察场景
    vec3 rayDirection = normalize(vec3(uv, -1.0));

    vec3 color = raytracing(rayOrigin, rayDirection);

    fragColor = vec4(color, 1.0);
}
