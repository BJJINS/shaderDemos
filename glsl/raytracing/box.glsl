struct Box {
    vec3 center;
    vec3 size;
    vec3 color;
    float specularPower; // 高光反射指数
};

Box boxes[1] = Box[1](
        Box(vec3(0.0, 0.0, -3.0), vec3(0.5), vec3(1.0, 0.8, 0.2), 2.0) // 卡通黄色
    );

// 计算光线与立方体的相交点
// 参数：
//   ro - 光线起点 必须是box的中心位置，否则需要先将ro转换到box的局部坐标 (cameraPosition - box.center)
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

vec4 closestBoxIntersection(in vec3 rayOrigin, in vec3 rayDirection, float min_t, float max_t, out Box outBox) {
    float closestT = max_t;
    vec3 normal;

    vec4 hit = vec4(0.0, 0.0, 0.0, -1.0);
    for (int i = 0; i < 1; i++) {
        Box box = boxes[i];
        vec3 localRo = rayOrigin - box.center; // 转换到立方体局部坐标
        // 修改为绕y轴旋转的矩阵
        mat3x3 rotationMatrix = mat3x3(
            cos(u_time), 0.0, sin(u_time),
            0.0, 1.0, 0.0,
            -sin(u_time), 0.0, cos(u_time)
        );
        localRo = rotationMatrix * localRo;
        vec3 rotatedRayDir = rotationMatrix * rayDirection;
        vec2 t = boxIntersect(localRo, rotatedRayDir, box.size, normal);
        if (t.x > min_t && t.x < max_t && t.x < closestT) {
            closestT = t.x;
            outBox = box;
            hit = vec4(transpose(rotationMatrix) * normal, closestT);
        }
        if (t.y > min_t && t.y < max_t && t.y < closestT) {
            closestT = t.y;
            outBox = box;
            hit = vec4(transpose(rotationMatrix) * normal, closestT);
        }
    }
    return hit;
}

// 射线与球体是否相交
bool isBoxIntersect(in vec3 rayOrigin, in vec3 rayDirection, float min_t, float max_t) {
    vec3 normal;
    for (int i = 0; i < 1; i++) {
        Box box = boxes[i];
        vec3 localRo = rayOrigin - box.center; // 转换到立方体局部坐标
        // 添加旋转矩阵，与closestBoxIntersection函数保持一致
        mat3x3 rotationMatrix = mat3x3(
            cos(u_time), 0.0, sin(u_time),
            0.0, 1.0, 0.0,
            -sin(u_time), 0.0, cos(u_time)
        );
        localRo = rotationMatrix * localRo;
        vec3 rotatedRayDir = rotationMatrix * rayDirection;
        vec2 t = boxIntersect(localRo, rotatedRayDir, box.size, normal);
        if (t.x > min_t && t.x < max_t) {
            return true;
        }
        if (t.y > min_t && t.y < max_t) {
            return true;
        }
    }
    return false;
}