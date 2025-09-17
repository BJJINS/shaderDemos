/**
 * 初始化光线
 * @param {vec3} rayOrigin 光线起点
 * @param {vec3} target 目标点
 * @returns {vec3} 射线方向
 */
vec3 ray(vec3 rayOrigin, vec3 target) {
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / u_resolution.y;
    vec3 eyeDir = normalize(target - rayOrigin); // 视线防线
    vec3 direction = normalize(vec3(uv, 1.0));
    // 计算相机的坐标系
    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 right = normalize(cross(eyeDir, up));
    up = normalize(cross(right, eyeDir));
    // 根据视线方向旋转视口
    mat3 viewPortMatrix = mat3(
            right,
            up,
            eyeDir
        );
    return viewPortMatrix * direction;
}