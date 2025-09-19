#version 300 es
precision mediump float;

uniform vec2 u_resolution; // 屏幕分辨率
uniform float u_time; // 时间

out vec4 fragColor; // 输出颜色

#include "constants.glsl" // 常量定义
#include "sphere.glsl" // 球体相关定义和函数
#include "box.glsl" // 立方体相关定义和函数
#include "plane.glsl" // 平面相关定义和函数
#include "light.glsl" // 光照相关函数   
#include "ray.glsl" // 射线相关定义和函数

/**
 * 反射
 * @param hitPoint 交点位置
 * @param incidentRay 入射光线
 * @param normal 交点法线
 * @return vec4 反射颜色
 */
vec4 rayReflect(in vec3 hitPoint, in vec3 incidentRay, in vec3 normal, float min_t, float max_t, int n) {
    vec3 color = vec3(0.0);
    float hitType = -1.0;
    vec3 rayDirection = reflect(incidentRay, normal);
    // 在反射起点添加一个微小的偏移，防止自相交
    vec3 rayOrigin = hitPoint + normal * 0.001;
    float reflectionFactor = 1.0;

    for (int i = 0; i < n; i++) {
        mat3x3 hitInfo = raytracingImpl(rayOrigin, rayDirection, min_t, max_t);
        vec3 hitNormal = hitInfo[0];
        vec3 objectColor = hitInfo[1];
        float closestT = hitInfo[2].y;

        if (hitInfo[2].z >= 0.0) {
            hitType = hitInfo[2].z;
            color = objectColor * reflectionFactor;

            // 更新下一次反射的光线
            rayOrigin = rayOrigin + rayDirection * closestT + hitNormal * 0.001;
            rayDirection = reflect(rayDirection, hitNormal);
            reflectionFactor *= 0.9; // 每次反射后略微衰减，增加真实感
        } else {
            break; // 没有击中任何物体，结束反射
        }
    }

    return vec4(color, hitType);
}

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

        // 环境光（降低强度以便看到其他光照效果）
        vec3 ambientColor = ambient(lightColor, 0.3);
        // 点光源（统一光源位置）
        vec3 pointLightColor = pointLight(lightColor, 2.0, lightPos, hitPoint, hitNormal, viewDirection, specularPower, 0.1);

        // 如果是地板，不计算反射
        if (hitType == 2.0) {
            finalColor = objectColor * shadowFactor;
        } else {
            // 计算反射颜色
            vec4 reflectInfo = rayReflect(hitPoint, rayDirection, hitNormal, 0.001, 1000.0, 1);
            if (reflectInfo.a >= 0.0 && reflectInfo.a != 2.0) {
                objectColor = reflectInfo.rgb;
            }
            finalColor = (ambientColor + pointLightColor * shadowFactor) * objectColor;
        }
    }
    return vec4(finalColor, 1.0);
}

void main() {
    vec3 rayDirection = ray(rayOrigin, target, 2.0);
    fragColor = raytracing(rayOrigin, rayDirection, 1.0, 1000.0);
}
