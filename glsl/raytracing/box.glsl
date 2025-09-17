struct Box {
    vec3 center;
    vec3 size;
    vec3 color;
};

Box boxes[1] = Box[1](
        Box(vec3(0.0, 0.0, 3.0), vec3(1.0), vec3(148, 147, 150) / 255.0) // 绿色立方体便于观察
    );

vec2 boxIntersect(in vec3 ro, in vec3 rd, vec3 boxSize, out vec3 outNormal) {
    vec3 m = 1.0 / rd;
    vec3 n = m * ro;
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
