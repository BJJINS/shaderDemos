// 光照函数
vec3 ambient(vec3 color, float intensity) {
    return color * intensity;
}

/**
    点光源
    color: 光源颜色
    intensity: 光源强度
    position: 光源位置
    hitPoint: 交点位置 | 顶点位置
    normal: 交点法线
    viewDirection: 视线防线，相机位置-交点位置
    specularPower: 高光反射指数
    decayPower: 衰减指数
*/
vec3 pointLight(vec3 color, float intensity, vec3 position, vec3 hitPoint, vec3 normal, vec3 viewDirection, float specularPower, float decayPower) {
    vec3 lightDir = normalize(position - hitPoint);
    float distance = length(position - hitPoint);

    // 漫反射
    float diff = max(dot(normal, lightDir), 0.0);

    // 高光反射
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDirection, reflectDir), 0.0), specularPower);

    // 衰减
    float attenuation = 1.0 / (1.0 + decayPower * distance);

    return color * intensity * attenuation * (diff + spec);
}

// 菲涅尔反射
float fresnel(float bias, float scale, float power, vec3 I, vec3 N) {
    return bias + scale * pow(1.0 - dot(I, N), power);
}

// 镜面反射
vec3 specularLight(vec3 color, float intensity, vec3 normal, vec3 viewDirection) {
    float fres = fresnel(0.2, 1.0, 5.0, viewDirection, normal);
    return fres * color * intensity;
}

float shadow(vec3 hitPoint, vec3 lightPos) {
    // 阴影优化：修复阴影检测逻辑和改进阴影颜色
    float shadowFactor = 1.0; // 默认完全照亮
    vec3 shadowRayDirection = normalize(lightPos - hitPoint);
    float lightDistance = length(lightPos - hitPoint); // 计算到光源的距离
    Sphere shadowSphere;
    Box shadowBox;
    vec4 shadowSphereHit = closestSpheresIntersection(hitPoint, shadowRayDirection, 0.001, lightDistance, shadowSphere);
    vec4 shadowBoxHit = closestBoxIntersection(hitPoint, shadowRayDirection, 0.001, lightDistance, shadowBox);
    if (shadowSphereHit.w > 0.0 || shadowBoxHit.w > 0.0) {
        shadowFactor = 0.5; // 阴影颜色
    }
    return shadowFactor;
}
