#version 300 es
precision mediump float;
out vec4 fragColor;

uniform vec2 u_resolution;

struct Sphere {
    vec3 center; // 球心
    float radius; // 半径
    vec3 color; // 球颜色
};

Sphere spheres[] = Sphere[](
        Sphere(vec3(0.0, 0.0, -3.0), 1.0, vec3(1.0))
    );

vec2 sphIntersect(vec3 rayOrigin, vec3 rayDirection, Sphere sphere) {
    vec3 oc = rayOrigin - sphere.center;
    float a = dot(rayDirection, rayDirection);
    float b = 2.0 * dot(oc, rayDirection);
    float c = dot(oc, oc) - sphere.radius * sphere.radius;
    float discriminant = b * b - 4.0 * a * c;
    if (discriminant < 0.0) {
        return vec2(-1.0, -1.0);
    }
    float t1 = (-b - sqrt(discriminant)) / (2.0 * a);
    float t2 = (-b + sqrt(discriminant)) / (2.0 * a);
    return vec2(t1, t2);
}

vec3 ambient(vec3 color, float intensity) {
    return color * intensity;
}

vec3 pointLight(vec3 color, float intensity, vec3 position, vec3 hitPoint, vec3 normal){
    vec3 lightDirection = normalize(position - hitPoint);
    float diffuse = max(dot(normal, lightDirection), 0.0);
    return diffuse * color * intensity;
}

vec3 raytracing(vec3 rayOrigin, vec3 rayDirection) {
    vec3 lightColor = vec3(.875, .286, .333);
    vec3 light = vec3(0.0);

    float minT = 1.0;
    float maxT = 1000.0;
    float closestT = maxT;
    vec3 color = vec3(0.0); // 背景颜色 黑色
    bool hitSomething = false;
    Sphere sphere;
    for (int i = 0; i < 2; i++) {
        Sphere sphere = spheres[i];
        vec2 t = sphIntersect(rayOrigin, rayDirection, sphere);
        if (t.x > minT && t.x < maxT && t.x < closestT) {
            closestT = t.x;
            color = sphere.color;
            hitSomething = true;
            sphere = spheres[i];
        }
        if (t.y > minT && t.y < maxT && t.y < closestT) {
            closestT = t.y;
            color = sphere.color;
            hitSomething = true;
            sphere = spheres[i];
        }
    }
    if (hitSomething) {
        light += ambient(lightColor, 0.2);
        vec3 hitPoint = rayOrigin + rayDirection * closestT;
        vec3 normal = normalize(hitPoint - sphere.center);

        light += pointLight(lightColor, 1.0, vec3(10.0, 10.0, -3.0), hitPoint, normal);

    }
    return color * light;
}

void main() {
    float aspect = u_resolution.x / u_resolution.y;
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / u_resolution.y;
    vec3 rayOrigin = vec3(0.0, 0.0, 0.0); // 相机位置
    vec3 forward = vec3(0.0, 0.0, -1.0); // 看向的方向
    float d = 1.0;
    vec3 rayDirection = normalize(vec3(uv, 0.0) + forward * d);
    vec3 color = raytracing(rayOrigin, rayDirection);
    fragColor = vec4(color, 1.0);
}
