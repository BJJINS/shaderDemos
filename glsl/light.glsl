// 光照函数
vec3 ambient(vec3 color, float intensity) {
    return color * intensity;
}

vec3 pointLight(vec3 color, float intensity, vec3 position, vec3 hitPoint, vec3 normal, vec3 viewDirection, float specularPower, float decayPower) {
    vec3 lightDir = normalize(position - hitPoint);
    float distance = length(position - hitPoint);

    // 漫反射
    float diff = max(dot(normal, lightDir), 0.0);

    // 高光反射
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDirection, reflectDir), 0.0), specularPower);

    // 衰减
    float attenuation = 1.0 / (1.0 + decayPower * distance * distance);

    return color * intensity * attenuation * (diff + spec);
}

float fresnel(float bias, float scale, float power, vec3 I, vec3 N) {
    return bias + scale * pow(1.0 - dot(I, N), power);
}

vec3 specularLight(vec3 color, float intensity, vec3 normal, vec3 viewDirection) {
    float fres = fresnel(0.2, 1.0, 5.0, viewDirection, normal);
    return fres * color * intensity;
}
