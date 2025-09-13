vec3 ambient(vec3 color, float intensity) {
    return color * intensity;
}

/**
    color 光线颜色
    intensity 光线强度
    position 光源位置
    hitPoint 交点位置
    normal 交点法线
    viewDirection 视图方向
    specularPower 高光指数
    decayPower 衰减指数
*/
vec3 pointLight(vec3 color, float intensity, vec3 position, vec3 hitPoint, vec3 normal, vec3 viewDirection, float specularPower, float decayPower) {
    vec3 lightDelta = position - hitPoint;
    float lightDistance = length(lightDelta);

    vec3 direction = normalize(position - hitPoint);
    float diff = max(dot(normal, direction), 0.0);

    vec3 lightReflection = reflect(-direction, normal);
    float specular = dot(viewDirection, lightReflection);
    specular = max(specular, 0.0);
    specular = pow(specular, specularPower);

    float decay = 1.0 - lightDistance * decayPower;
    decay = max(decay, 0.0);

    return color * intensity * decay * (diff + specular);
}

/**
    color 光线颜色
    intensity 光线强度
    normal 交点法线
    position 光源位置
    viewDirection 视图方向
    specularPower 高光指数
*/
vec3 directionLight(vec3 color, float intensity, vec3 normal, vec3 position, vec3 viewDirection, float specularPower) {
    vec3 direction = normalize(position);

    float diff = max(dot(normal, direction), 0.0);
    vec3 lightReflection = reflect(-direction, normal);
    float specular = dot(viewDirection, lightReflection);
    specular = max(specular, 0.0);
    specular = pow(specular, specularPower);

    return (diff + specular) * color * intensity;
}

float fresnel(
    float bias, // 基础反射系数 控制最小反射强度
    float scale, // 反射强度缩放因子 控制反射强度的变化范围
    float power, // 菲涅耳衰减指数 控制反射强度随角度变化的速率
    vec3 I, // 入射方向向量 （从表面指向视点）
    vec3 N)
{ // 表面法线向量
    return bias + scale * pow(1. - dot(I, N), power);
}

vec3 specularLight(vec3 color, float intensity, vec3 normal,  vec3 viewDirection) {
    float fres = fresnel(0.2, 1., 5., viewDirection, normal);
    vec3 fresLight = fres * color * intensity;
    return fresLight;
}
