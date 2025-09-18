struct Sphere {
    vec3 center;
    float radius;
    vec3 color;
    float specularPower; // 高光反射指数
};

Sphere spheres[2] = Sphere[2](
        Sphere(vec3(2.0, 0.0, -4.0), 1.0, vec3(.875, .286, .333), 40.0),
        Sphere(vec3(-2.0, 0.0, -4.0), 1.0, vec3(0.192, 0.439, 0.651), 2.0)
    );

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

// 射线与球体先交处的法线
vec3 sphereNormal(vec3 rayOrigin, vec3 rayDirection, Sphere sphere, float t) {
    vec3 hitPoint = rayOrigin + rayDirection * t;
    return normalize(hitPoint - sphere.center);
}

vec4 closestSpheresIntersection(in vec3 rayOrigin, in vec3 rayDirection, float min_t, float max_t, out Sphere outSphere) {
    float closestT = max_t;
    vec4 hit = vec4(0.0, 0.0, 0.0, -1.0);
    for (int i = 0; i < 2; i++) {
        Sphere sphere = spheres[i];
        vec2 t = sphIntersect(rayOrigin, rayDirection, sphere);
        if (t.x > min_t && t.x < max_t && t.x < closestT) {
            closestT = t.x;
            outSphere = sphere;
        }
        // if (t.y > min_t && t.y < max_t && t.y < closestT) {
        //     closestT = t.y;
        //     outSphere = sphere;
        // }
    }
    if (closestT < max_t) {
        hit = vec4(sphereNormal(rayOrigin, rayDirection, outSphere, closestT), closestT);
    }
    return hit;
}
