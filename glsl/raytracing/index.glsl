#version 300 es
precision mediump float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;

out vec4 fragColor;

#include "light.glsl"
#include "sphere.glsl"
#include "box.glsl"





// 修复的光线追踪函数
vec3 raytracing(in vec3 rayOrigin, in vec3 rayDirection) {
    const float minT = 0.001; // 防止自相交
    const float maxT = 1000.0;
    float closestT = maxT;
    vec3 finalColor = vec3(0.0);
    vec3 hitNormal;
    bool hitSomething = false;
    vec3 objectColor = vec3(0.0);

    // 检查球体
    for (int i = 0; i < 2; i++) {
        Sphere s = spheres[i];
        vec2 t = sphIntersect(rayOrigin, rayDirection, s);
        if (t.x > minT && t.x < maxT && t.x < closestT) {
            closestT = t.x;
            hitSomething = true;
            vec3 hitPoint = rayOrigin + rayDirection * t.x;
            hitNormal = normalize(hitPoint - s.center);
            objectColor = s.color;
        }
    }

    // 检查立方体（使用局部坐标系）
    for (int i = 0; i < 1; i++) {
        Box b = boxes[i];
        vec3 localRo = rayOrigin - b.center; // 转换到立方体局部坐标
        vec3 normal;
        vec2 t = boxIntersect(localRo, rayDirection, b.size * 0.5, normal);

        if (t.x > minT && t.x < maxT && t.x < closestT) {
            closestT = t.x;
            hitSomething = true;
            hitNormal = normal; // 直接使用计算出的法线
            objectColor = b.color;
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

mat3 rotateX3x3(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat3(
        1.0, 0.0, 0.0,
        0.0, c, -s,
        0.0, s, c
    );
}

void main() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / u_resolution.y;
    float angle = radians(-45.0); // 45度
    mat3 rotationMatrix = rotateX3x3(angle);

    vec3 rayOrigin = vec3(0.0, 7.0, -2.0); // 相机位置
    vec3 rayDirection = normalize(rotationMatrix * vec3(uv, 1.0));
    vec3 color = raytracing(rayOrigin, rayDirection);
    fragColor = vec4(color, 1.0);
}
