#version 300 es
precision mediump float;

out vec4 fragColor; // 着色器输出颜色

uniform vec2 u_resolution;
uniform float u_time;

// ============== 球体相关 ==============
struct BaseSphere {
    vec3 center;
    vec3 color;
    float radius;
    float specularPower;
};
struct Sphere {
    BaseSphere baseSphere;
    vec3 normal;
    float closetT;
};
BaseSphere spheres[2] = BaseSphere[2](
        BaseSphere(vec3(2.0, 0.0, -4.0), vec3(.875, .286, .333), 1.0, 40.0),
        BaseSphere(vec3(-2.0, 0.0, -4.0), vec3(0.192, 0.439, 0.651), 1.0, 2.0)
    );

/**
 * 球体相交检测
 * @param rayOrigin 射线原点
 * @param rayDirection 射线方向
 * @param sphere 球体
 * @return vec2 交点参数 t1, t2。
 */
vec2 sphIntersect(in vec3 rayOrigin, in vec3 rayDirection, in BaseSphere sphere) {
    vec3 oc = rayOrigin - sphere.center;
    float b = dot(oc, rayDirection);
    float c = dot(oc, oc) - sphere.radius * sphere.radius;
    float h = b * b - c;
    if (h < 0.0) return vec2(-1.0); // 无交点
    h = sqrt(h);
    return vec2(-b - h, -b + h);
}

Sphere intersectSpheres(in vec3 rayOrigin, in vec3 rayDirection, float minT, float maxT) {
    float closetT = maxT;
    vec3 normal;
    BaseSphere hitSphere;
    for (int i = 0; i < 2; i++) {
        BaseSphere sphere = spheres[i];
        vec2 ts = sphIntersect(rayOrigin, rayDirection, sphere);
        if (ts.x > minT && ts.x < maxT && ts.x < closetT) {
            closetT = ts.x;
            hitSphere = sphere;
        }
        if (ts.y > minT && ts.y < maxT && ts.y < closetT) {
            closetT = ts.y;
            hitSphere = sphere;
        }
    }

    if (closetT < maxT) {
        normal = normalize(vec3(rayOrigin + rayDirection * closetT - hitSphere.center));
    }

    return Sphere(
        hitSphere,
        normal,
        closetT
    );
}

// ============== 立方体 ==============
/**
 * 如何定义一个立方体?
 * 立方体用mat4x3表示:
 *  vec3 center 立方体中心
 *  vec3 color 立方体颜色
 *  vec3 size 立方体大小
 *  vec3 (float specularPower 高光反射指数 ,-1.0, -1.0)
 */
mat4x3 boxes[1] = mat4x3[1](
        mat4x3(vec3(0.0, 0.0, -3.0), vec3(1.0, 0.8, 0.2), vec3(0.5), vec3(2.0, -1.0, -1.0))
    );
/**
 * 立方体相交检测
 * @param ro 射线原点
 * @param rd 射线方向
 * @param boxSize 立方体大小
 * @param outNormal 输出参数，存储交点处的法向量
 * @return mat2x3 交点参数 t1, t2。
 */
mat2x3 boxIntersect(vec3 ro, vec3 rd, vec3 boxSize, out vec3 outNormal) {
    vec3 m = 1.0 / rd;
    vec3 n = m * ro;
    vec3 k = abs(m) * boxSize;
    vec3 t1 = -n - k;
    vec3 t2 = -n + k;
    float tN = max(max(t1.x, t1.y), t1.z);
    float tF = min(min(t2.x, t2.y), t2.z);
    vec3 normal = vec3(0.0);
    if (tN > tF || tF < 0.0) return mat2x3(vec3(-1.0), normal);
    normal = (tN > 0.0) ? step(vec3(tN), t1) : step(t2, vec3(tF));
    normal *= -sign(rd);
    return mat2x3(vec3(tN, tF, -1.0), normal);
}

// ============== 射线相关 ==============
vec3 rayOrigin = vec3(0.0, 5.0, 3.0); // 射线原点（相机位置）
vec3 lookAt = vec3(0.0, 0.0, -5.0); // 相机看的目标位置
float dis = 2.0;

/**
 * 创建射线
 * @return vec3 射线方向
 */
vec3 createRay() {
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / u_resolution.y;
    vec3 view = normalize(lookAt - rayOrigin);
    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 right = normalize(cross(view, up));
    up = normalize(cross(right, view));

    vec3 rayDirection = vec3(uv, dis);
    mat3 viewProjectMatrix = mat3(
            right,
            up,
            view
        );
    rayDirection = viewProjectMatrix * rayDirection;
    return rayDirection;
}

void raytracing(in vec3 rayOrigin, in vec3 rayDirection) {
    // dis表示视口到相机的位置，检查相交的解必须大于dis
    // 如果小于等于dis，表示射线和球体的交点在视口到相机的一侧
    Sphere sphere = intersectSpheres(rayOrigin, rayDirection, dis, 1000.0);
}

void main() {
    vec3 rayDirection = createRay();
    fragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
