#version 300 es
precision mediump float;

uniform vec2 u_resolution; // 屏幕分辨率

out vec4 fragColor; // 输出颜色

#include "constants.glsl" // 常量定义
#include "sphere.glsl" // 球体相关定义和函数
#include "box.glsl" // 立方体相关定义和函数
#include "ray.glsl" // 射线相关定义和函数
#include "plane.glsl" // 平面相关定义和函数
#include "light.glsl" // 光照相关函数

// 修复的光线追踪函数
vec4 raytracing(in vec3 rayOrigin, in vec3 rayDirection, float min_t, float max_t) {
    float closestT = max_t;
    vec3 finalColor = backgroundColor;
    vec3 hitNormal;
    bool hitSomething = false;
    vec3 objectColor = vec3(0.0);
    float specularPower = 1.0; // 高光反射指数
    bool isPlane = false; // 地面步使用光照

    // 计算最近的球体相交
    Sphere hitSphere;
    vec4 hitSphereNormalT = closestSpheresIntersection(rayOrigin, rayDirection, min_t, max_t, hitSphere);
    if (hitSphereNormalT.w > 0.0 && hitSphereNormalT.w < closestT) {
        hitNormal = hitSphereNormalT.xyz; // 球体法线
        closestT = hitSphereNormalT.w; // 球体相交解t
        hitSomething = true;
        objectColor = hitSphere.color;
        specularPower = hitSphere.specularPower;
    }

    // 计算最近的立方体相交
    Box hitBox;
    vec4 hitBoxNormalT = closestBoxIntersection(rayOrigin, rayDirection, min_t, max_t, hitBox);
    if (hitBoxNormalT.w > 0.0 && hitBoxNormalT.w < closestT) {
        hitNormal = hitBoxNormalT.xyz; // 立方体法线
        closestT = hitBoxNormalT.w; // 立方体相交解t
        hitSomething = true;
        objectColor = hitBox.color;
        specularPower = hitBox.specularPower;
    }

    // 计算最近的地面相交
    vec4 hitPlaneNormalT = closestPlaneIntersection(rayOrigin, rayDirection, groundPlane, min_t, max_t);
    if (hitPlaneNormalT.w > 0.0 && hitPlaneNormalT.w < closestT) {
        hitNormal = hitPlaneNormalT.xyz; // 地面法线
        closestT = hitPlaneNormalT.w; // 地面相交解t
        hitSomething = true;
        objectColor = groundColor;
        isPlane = true;
    }
    if (hitSomething) {
        vec3 hitPoint = rayOrigin + rayDirection * closestT;
        vec3 viewDirection = normalize(rayOrigin - hitPoint);

        // 阴影优化：修复阴影检测逻辑和改进阴影颜色
        float shadowFactor = shadow(hitPoint, lightPos);
        
        if (isPlane) {
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