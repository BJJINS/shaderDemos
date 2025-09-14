#version 300 es
precision mediump float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

out vec4 fragColor;

struct Sphere {
    vec3 center;
    float radius;
    vec3 color;
};

struct Box {
    vec3 center;
    vec3 size;
    vec3 color;
};

vec3 lightColor = vec3(1.0);

Sphere spheres[2] = Sphere[2](
        Sphere(vec3(2.0, 0.0, -7.0), 1.0, vec3(.875, .286, .333)),
        Sphere(vec3(-6.0, 0.0, -7.0), 1.0, vec3(0.192, 0.439, 0.651))
    );

Box boxes[1] = Box[1](
        Box(vec3(0.0, 0.0, -7.0), vec3(1.0), vec3(148, 147, 150) / 255.0) // 绿色立方体便于观察
    );

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

// 球体相交检测
vec2 sphIntersect(in vec3 rayOrigin, in vec3 rayDirection, in Sphere sphere) {
    vec3 oc = rayOrigin - sphere.center;
    float b = dot(oc, rayDirection);
    float c = dot(oc, oc) - sphere.radius * sphere.radius;
    float h = b * b - c;
    if (h < 0.0) return vec2(-1.0); // 无交点
    h = sqrt(h);
    return vec2(-b - h, -b + h);
}

// 修复的立方体相交检测，确保法线正确
vec2 boxIntersect(in vec3 ro, in vec3 rd, vec3 boxSize, out vec3 outNormal)
{
    vec3 m = 1.0 / rd; // can precompute if traversing a set of aligned boxes
    vec3 n = m * ro; // can precompute if traversing a set of aligned boxes
    vec3 k = abs(m) * boxSize;
    vec3 t1 = -n - k;
    vec3 t2 = -n + k;
    float tN = max(max(t1.x, t1.y), t1.z);
    float tF = min(min(t2.x, t2.y), t2.z);
    if (tN > tF || tF < 0.0) return vec2(-1.0); // no intersection
    outNormal = (tN > 0.0) ? step(vec3(tN), t1) : step(t2, vec3(tF));
    outNormal *= -sign(rd);
    return vec2(tN, tF);
}

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

        // 使用单个光源位置便于调试
        vec3 lightPos = vec3(5.0 * sin(u_time), 3.0, -5.0 + 5.0 * cos(u_time));

        // 环境光（降低强度以便看到其他光照效果）
        finalColor = ambient(lightColor, 0.1);

        // 点光源（统一光源位置）
        finalColor += pointLight(lightColor, 3.0, lightPos, hitPoint, hitNormal, viewDirection, 32.0, 0.1);

        // 高光
        finalColor += specularLight(lightColor, 0.5, hitNormal, viewDirection);

        // 应用物体颜色
        finalColor *= objectColor;
    } else {
        // 背景色
        finalColor = vec3(0.1, 0.1, 0.2);
    }

    return finalColor;
}

void main() {
    // 计算UV坐标
    float aspect = u_resolution.x / u_resolution.y;
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / u_resolution.y;
    float fov = 60.0;
    float fovRad = radians(fov);

    // 相机设置
    vec3 rayOrigin = vec3(0.0, 0.0, 5.0); // 相机位置
    vec3 rayTarget = vec3(0.0, 0.0, -1.0); // 看向的点
    float dis = 1.0;
    vec3 forward = normalize(rayTarget - rayOrigin) / tan(fovRad / 2.0);
    vec3 rayDirection = normalize(vec3(uv, 0.0) + forward * dis);
    vec3 color = raytracing(rayOrigin, rayDirection);
    fragColor = vec4(color, 1.0);
}
