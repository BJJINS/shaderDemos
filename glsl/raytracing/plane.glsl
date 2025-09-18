/**
 * 平面相交 地面 或者 墙面
 * @param {vec3} ro 光线起点
 * @param {vec3} rd 光线方向
 * @param {vec4} p 平面参数 p.xyz 平面法向量 p.w 平面常量
 * @returns {float} 相交解t 交点：hitPoint = rayOrigin + rayDirection * t;
 */
float plaIntersect(vec3 ro, vec3 rd, vec4 p) {
    return -(dot(ro, p.xyz) + p.w) / dot(rd, p.xyz);
}

vec4 closestPlaneIntersection(in vec3 rayOrigin, in vec3 rayDirection, in vec4 groundPlane, float min_t, float max_t) {
    float t = plaIntersect(rayOrigin, rayDirection, groundPlane);
    if (t > min_t && t < max_t) {
        vec3 hitPoint = rayOrigin + rayDirection * t;
        if (abs(hitPoint.x) < 6.0 && abs(hitPoint.z) < 10.0) {
            return vec4(groundPlane.xyz, t);
        }
    }
    return vec4(0.0, 0.0, 0.0, -1.0);
}
