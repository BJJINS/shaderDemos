#version 300 es
precision mediump float;

uniform vec2 u_resolution; // 屏幕分辨率

out vec4 fragColor; // 输出颜色

#include "constants.glsl" // 常量定义
#include "sphere.glsl" // 球体相关定义和函数
#include "box.glsl" // 立方体相关定义和函数
#include "plane.glsl" // 平面相关定义和函数
#include "light.glsl" // 光照相关函数
#include "ray.glsl" // 射线相关定义和函数

// vec4 rayReflect(in vec3 rayOrigin, in vec3 rayDirection, float min_t, float max_t) {

vec4 raytracing(in vec3 rayOrigin, in vec3 rayDirection, float min_t, float max_t) {
    vec3 finalColor = backgroundColor;

    mat3x3 hitInfo = raytracingImpl(rayOrigin, rayDirection, min_t, max_t);
    vec3 hitNormal = hitInfo[0];
    vec3 objectColor = hitInfo[1];
    float specularPower = hitInfo[2].x;
    float closestT = hitInfo[2].y;
    float hitType = hitInfo[2].z;

    if (hitType >= 0.0) {
        vec3 hitPoint = rayOrigin + rayDirection * closestT;
        vec3 viewDirection = normalize(rayOrigin - hitPoint);

        // 阴影检测
        float shadowFactor = shadow(hitPoint, lightPos);

        if (hitType == 2.0) { // 地板
            finalColor = objectColor * shadowFactor; // 对平面应用阴影
        } else {
            // 环境光（降低强度以便看到其他光照效果）
            vec3 ambientColor = ambient(lightColor, 0.3);
            // 点光源（统一光源位置）
            vec3 pointLightColor = pointLight(lightColor, 2.0, lightPos, hitPoint, hitNormal, viewDirection, specularPower, 0.1);
            // 应用物体颜色和阴影
            finalColor = (ambientColor + pointLightColor * shadowFactor) * objectColor;
        }
    }
    return vec4(finalColor, 1.0);
}

void main() {
    vec3 rayDirection = ray(rayOrigin, target, 2.0);
    fragColor = raytracing(rayOrigin, rayDirection, 1.0, 1000.0);
}
