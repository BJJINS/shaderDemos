struct Box {
    vec3 center;
    vec3 size;
    vec3 color;
};

// 计算光线与立方体的相交点
// 参数：
//   ro - 光线起点 必须是box的中心位置，否则需要先将ro转换到box的局部坐标
//   rd - 光线方向（单位向量）
//   boxSize - 立方体尺寸
//   outNormal - 输出参数，存储交点处的法向量
// 返回值：
//   vec2(tN, tF) - 近交点和远交点的距离参数，如果没有交点则返回(-1.0)
vec2 boxIntersect(vec3 ro, vec3 rd, vec3 boxSize, out vec3 outNormal) {
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
