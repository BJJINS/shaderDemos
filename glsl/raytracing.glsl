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

// 添加立方体结构体
struct Box {
    vec3 center;
    vec3 size;
    vec3 color;
};

struct Viewport {
    float width; // 视口的宽度
    float height; // 视口的高度
    float dis; // 视口和相机的距离
};

Sphere spheres[2] = Sphere[2](
        Sphere(vec3(0.0, 0.0, -5.0), 1.0, vec3(1.0, 0.0, 0.0)), // 第一个球体
        Sphere(vec3(9.0, 1.0, -4.0), 1.0, vec3(0.0, 1.0, 0.0)) // 第二个球体
    );

// 添加一个立方体
Box boxes[1] = Box[1](
        Box(vec3(-2.0, 2.0, -3.0), vec3(1.0, 1.0, 1.0), vec3(0.0, 0.0, 1.0)) // 一个蓝色立方体
    );

vec2 sphIntersect(in vec3 rayOrigin, in vec3 rayDirection, in vec3 center, float radius) {
    vec3 oc = rayOrigin - center;
    float b = dot(oc, rayDirection);
    float c = dot(oc, oc) - radius * radius;
    float h = b * b - c;
    if (h < 0.0) return vec2(-1.0); // no intersection
    h = sqrt(h);
    return vec2(-b - h, -b + h);
}

vec2 boxIntersection(in vec3 ro, in vec3 rd, vec3 boxSize, out vec3 outNormal){
    vec3 m = 1.0 / rd; 
    vec3 n = m * ro;
    vec3 k = abs(m) * boxSize;
    vec3 t1 = -n - k;
    vec3 t2 = -n + k;
    float tN = max(max(t1.x, t1.y), t1.z);
    float tF = min(min(t2.x, t2.y), t2.z);
    if (tN > tF || tF < 0.0) {
        return vec2(-1.0);
    }
    outNormal = (tN > 0.0) ? step(vec3(tN), t1) : step(t2, vec3(tF));
    outNormal *= -sign(rd);
    return vec2(tN, tF);
}

vec3 coordToViewport(vec2 coord, Viewport viewport) {
    float x = coord.x * viewport.width / u_resolution.x;
    float y = coord.y * viewport.height / u_resolution.y;
    float z = -viewport.dis;
    return vec3(x, y, z);
}

vec3 raytracing(in vec3 rayOrigin, in vec3 rayDirection, in vec3 v, float minT, float maxT) {
    float closest_t = 100.0;
    vec3 color = vec3(0.0);

    // 检测与球体的相交
    for (int i = 0; i < 2; i++) {
        // 获取当前光源
        Sphere sphere = spheres[i];
        vec2 intersection = sphIntersect(rayOrigin, rayDirection, sphere.center, sphere.radius); // 将球体移到z=-3的位置
        if (intersection.x < closest_t && minT < intersection.x && intersection.x < maxT) {
            closest_t = intersection.x;
            color = sphere.color;
        }
        if (intersection.y < closest_t && minT < intersection.y && intersection.y < maxT) {
            closest_t = intersection.y;
            color = sphere.color;
        }
    }

    // 添加检测与立方体的相交
    vec3 normal;
    for (int i = 0; i < 1; i++) {
        Box box = boxes[i];
        vec2 intersection = boxIntersection(rayOrigin - box.center, rayDirection, box.size, normal);
        if (intersection.x < closest_t && minT < intersection.x && intersection.x < maxT) {
            closest_t = intersection.x;
            color = box.color;
        }
        if (intersection.y < closest_t && minT < intersection.y && intersection.y < maxT) {
            closest_t = intersection.y;
            color = box.color;
        }
    }

    return color;
}

void main() {
    float aspect = u_resolution.x / u_resolution.y;
    vec2 coord = vec2(gl_FragCoord.x - u_resolution.x / 2.0, gl_FragCoord.y - u_resolution.y / 2.0);

    Viewport viewport;
    viewport.dis = 1.0;
    viewport.height = 5.0;
    viewport.width = viewport.height * aspect;

    vec3 v = coordToViewport(coord, viewport);

    vec3 rayOrigin = vec3(0.0, 0.0, 0.0);
    vec3 rayDirection = normalize(v - rayOrigin);

    vec3 color = raytracing(rayOrigin, rayDirection, v, 1.0, 10.0);

    fragColor = vec4(color, 1.0);
}
