#version 300 es
precision mediump float;

in vec4 v_position;
in vec4 v_normal;

uniform vec3 u_camera;

out vec4 fragColor;

const vec3 lightColor = vec3(0.6118, 0.8353, 0.3373);

vec3 reflectManual(vec3 incident, vec3 normal) {
    vec3 parallel = dot(incident, normal) * normal; // 平行于法向量的分量
    vec3 perpendicular = incident - parallel; // 垂直于法向量的分量（入射 - 平行）
    vec3 reflected = perpendicular - parallel; // 垂直分量不变，平行分量反向
    return reflected;
}

vec3 ambientLight() {
    return lightColor * 0.3;
}

vec3 pointLight() {
    vec3 position = vec3(5.0);
    vec3 normal = normalize(v_normal.xyz);
    vec3 lightDirection = normalize(position - v_position.xyz);
    float diff = max(dot(normal, lightDirection), 0.0);

    vec3 viewDirection = normalize(u_camera - v_position.xyz);
    vec3 lightReflection = reflectManual(-lightDirection, normal);
    float spec = pow(max(dot(lightReflection, viewDirection), 0.0), 32.0);

    // toon
    diff *= diff > 0.7 ? 1.0 : diff > 0.3 ? 0.1 : 0.0;
    spec *= spec > 0.7 ? 1.0 : spec > 0.3 ? 0.1 : 0.0;

    return lightColor * (diff + spec);
}

void main() {
    vec3 color = vec3(1.0);
    vec3 light = vec3(0.0);
    light += ambientLight();
    light += pointLight();

    fragColor = vec4(color * light, 1.0);
}
