struct Sphere {
    vec3 center;
    float radius;
    vec3 color;
};

Sphere spheres[2] = Sphere[2](
        Sphere(vec3(2.0, 0.0, 3.0), 1.0, vec3(.875, .286, .333)),
        Sphere(vec3(-2.0, 0.0, 3.0), 1.0, vec3(0.192, 0.439, 0.651))
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
