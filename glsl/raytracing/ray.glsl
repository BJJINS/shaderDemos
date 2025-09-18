/**
 * 初始化光线
 * @param {vec3} rayOrigin 光线起点
 * @param {vec3} target 目标点
 * @returns {vec3} 射线方向
 */
vec3 ray(vec3 rayOrigin, vec3 target, float d) {
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / u_resolution.y;
    vec3 eyeDir = normalize(target - rayOrigin); // 视线防线
    vec3 direction = normalize(vec3(uv, d));
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

mat3x3 raytracingImpl(in vec3 rayOrigin, in vec3 rayDirection, float min_t, float max_t) {
    float closestT = max_t;
    vec3 hitNormal;
    float specularPower = 1.0; // 高光反射指数
    vec3 hitColor = vec3(0.0);
    float hitType = -1.0; // 0: 球体, 1: 立方体, 2: 地面, -1 无碰撞

    // 计算最近的球体相交
    Sphere hitSphere;
    vec4 hitSphereNormalT = closestSpheresIntersection(rayOrigin, rayDirection, min_t, max_t, hitSphere);
    if (hitSphereNormalT.w > 0.0 && hitSphereNormalT.w < closestT) {
        hitNormal = hitSphereNormalT.xyz; // 球体法线
        closestT = hitSphereNormalT.w; // 球体相交解t
        hitColor = hitSphere.color;
        specularPower = hitSphere.specularPower;
        hitType = 0.0;
    }

    // 计算最近的立方体相交
    Box hitBox;
    vec4 hitBoxNormalT = closestBoxIntersection(rayOrigin, rayDirection, min_t, max_t, hitBox);
    if (hitBoxNormalT.w > 0.0 && hitBoxNormalT.w < closestT) {
        hitNormal = hitBoxNormalT.xyz; // 立方体法线
        closestT = hitBoxNormalT.w; // 立方体相交解t
        hitColor = hitBox.color;
        specularPower = hitBox.specularPower;
        hitType = 1.0;
    }

    // 计算最近的地面相交
    vec4 hitPlaneNormalT = closestPlaneIntersection(rayOrigin, rayDirection, groundPlane, min_t, max_t);
    if (hitPlaneNormalT.w > 0.0 && hitPlaneNormalT.w < closestT) {
        hitNormal = hitPlaneNormalT.xyz; // 地面法线
        closestT = hitPlaneNormalT.w; // 地面相交解t
        hitColor = groundColor;
        hitType = 2.0;
    }

    return mat3x3(
        hitNormal, // 交点法线
        hitColor, // 交点颜色
        vec3(
            specularPower, // 交点高光反射指数
            closestT, // 交点最近距离解
            hitType // 交点类型
        ));
}
