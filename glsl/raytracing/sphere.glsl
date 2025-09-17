struct Sphere {
    vec3 center;
    float radius;
    vec3 color;
};

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
