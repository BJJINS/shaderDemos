#version 300 es
precision mediump float;

uniform vec2 u_resolution; // 屏幕分辨率
uniform vec2 u_mouse;

out vec4 fragColor; // 输出颜色

#include "light.glsl" // 光照相关函数
#include "sphere.glsl" // 球体相关定义和函数
#include "box.glsl" // 立方体相关定义和函数
#include "ray.glsl" // 射线相关定义和函数
#include "plane.glsl" // 平面相关定义和函数
#include "constants.glsl"

// 修复的光线追踪函数
vec3 raytracing(in vec3 rayOrigin, in vec3 rayDirection, float min_t, float max_t) {
    float closestT = max_t;
    vec3 finalColor = vec3(0.0);
    vec3 hitNormal;
    bool hitSomething = false;
    vec3 objectColor = vec3(0.0);

    // 检查球体
    for (int i = 0; i < 2; i++) {
        Sphere sphere = spheres[i];
        vec2 t = sphIntersect(rayOrigin, rayDirection, sphere);
        if (t.x > min_t && t.x < max_t && t.x < closestT) {
            closestT = t.x;
            hitSomething = true;
            hitNormal = sphereNormal(rayOrigin, rayDirection, sphere, t.x);
            objectColor = sphere.color;
        }
    }

    // 检查立方体（使用局部坐标系）
    for (int i = 0; i < 1; i++) {
        Box b = boxes[i];
        vec3 localRo = rayOrigin - b.center; // 转换到立方体局部坐标
        vec3 normal;
        vec2 t = boxIntersect(localRo, rayDirection, b.size * 0.5, normal);
        if (t.x > min_t && t.x < max_t && t.x < closestT) {
            closestT = t.x;
            hitSomething = true;
            hitNormal = normal; // 直接使用计算出的法线
            objectColor = b.color;
        }
    }

    // 添加地面平面相交检查
    float tGround = plaIntersect(rayOrigin, rayDirection, groundPlane);
    vec3 hitPoint = rayOrigin + rayDirection * tGround;
    if (abs(hitPoint.x) < 6.0 && abs(hitPoint.z) < 10.0) {
        if (tGround > min_t && tGround < max_t && tGround < closestT) {
            closestT = tGround;
            hitSomething = true;
            hitNormal = groundPlane.xyz; // 平面法线
            objectColor = groundColor; // 白色地面
            isPlane = true;
        }
    }

    // 计算光照（对所有物体使用相同的光照逻辑）
    if (hitSomething) {
        vec3 hitPoint = rayOrigin + rayDirection * closestT;
        vec3 viewDirection = normalize(rayOrigin - hitPoint);

        // 环境光（降低强度以便看到其他光照效果）
        finalColor = ambient(lightColor, 0.3);
        // 点光源（统一光源位置）
        finalColor += pointLight(lightColor, 2.0, lightPos, hitPoint, hitNormal, viewDirection, 4.0, 0.1);
        // 应用物体颜色
        finalColor *= objectColor;
    } else {
        // 背景色
        finalColor = vec3(0.1, 0.1, 0.2);
    }
    return finalColor;
}

void main() {
    vec3 rayDirection = ray(rayOrigin, target, 2.0);
    vec3 color = raytracing(rayOrigin, rayDirection, 1.0, 1000.0);
    fragColor = vec4(color, 1.0);
}
