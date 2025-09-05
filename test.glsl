/* 带阴影的光线追踪渲染旋转立方体 - 兼容OpenGL 2.0 (WebGL 1.0) */
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;  // 画布分辨率
uniform vec2 u_mouse;       // 鼠标位置
uniform float u_time;       // 时间

// 三角形结构体
struct Triangle {
    vec3 v0, v1, v2;  // 三个顶点
    vec3 normal;      // 法线
    vec3 color;       // 颜色
};

// 光线结构体
struct Ray {
    vec3 origin;      // 起点
    vec3 direction;   // 方向
};

// 相交结果结构体
struct Hit {
    bool isHit;       // 是否命中
    float t;          // 命中点参数
    vec3 normal;      // 命中点法线
    vec3 color;       // 命中点颜色
};

// 旋转矩阵函数 - 绕X轴旋转
mat4 rotateX(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, c, -s, 0.0,
        0.0, s, c, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
}

// 旋转矩阵函数 - 绕Y轴旋转
mat4 rotateY(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat4(
        c, 0.0, s, 0.0,
        0.0, 1.0, 0.0, 0.0,
        -s, 0.0, c, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
}

// 计算光线与三角形的相交 - Möller-Trumbore算法
Hit rayTriangleIntersect(Ray ray, Triangle tri) {
    Hit hit;
    hit.isHit = false;
    
    const float EPSILON = 0.0001;
    vec3 edge1 = tri.v1 - tri.v0;
    vec3 edge2 = tri.v2 - tri.v0;
    vec3 h = cross(ray.direction, edge2);
    float a = dot(edge1, h);
    
    if (a > -EPSILON && a < EPSILON)
        return hit; // 光线与三角形平行
    
    float f = 1.0 / a;
    vec3 s = ray.origin - tri.v0;
    float u = f * dot(s, h);
    
    if (u < 0.0 || u > 1.0)
        return hit;
    
    vec3 q = cross(s, edge1);
    float v = f * dot(ray.direction, q);
    
    if (v < 0.0 || u + v > 1.0)
        return hit;
    
    // 计算命中参数t
    float t = f * dot(edge2, q);
    
    if (t > EPSILON) { // 确保交点在光线前方
        hit.isHit = true;
        hit.t = t;
        hit.normal = tri.normal;
        hit.color = tri.color;
    }
    
    return hit;
}

// 创建立方体的三角形网格
void createCubeTriangles(inout Triangle triangles[12]) {
    // 定义立方体的8个顶点
    vec3 vertices[8];
    vertices[0] = vec3(-0.5, -0.5, 0.5);
    vertices[1] = vec3(0.5, -0.5, 0.5);
    vertices[2] = vec3(0.5, 0.5, 0.5);
    vertices[3] = vec3(-0.5, 0.5, 0.5);
    vertices[4] = vec3(-0.5, -0.5, -0.5);
    vertices[5] = vec3(0.5, -0.5, -0.5);
    vertices[6] = vec3(0.5, 0.5, -0.5);
    vertices[7] = vec3(-0.5, 0.5, -0.5);
    
    // 定义6个面的颜色
    vec3 faceColors[6];
    faceColors[0] = vec3(1.0, 0.0, 0.0); // 前 - 红
    faceColors[1] = vec3(0.0, 1.0, 0.0); // 后 - 绿
    faceColors[2] = vec3(0.0, 0.0, 1.0); // 右 - 蓝
    faceColors[3] = vec3(1.0, 1.0, 0.0); // 左 - 黄
    faceColors[4] = vec3(1.0, 0.0, 1.0); // 上 - 紫
    faceColors[5] = vec3(0.0, 1.0, 1.0); // 下 - 青
    
    // 前 face (0,1,2,3)
    triangles[0] = Triangle(vertices[0], vertices[1], vertices[2], vec3(0.0, 0.0, 1.0), faceColors[0]);
    triangles[1] = Triangle(vertices[0], vertices[2], vertices[3], vec3(0.0, 0.0, 1.0), faceColors[0]);
    
    // 后 face (5,4,7,6)
    triangles[2] = Triangle(vertices[5], vertices[4], vertices[7], vec3(0.0, 0.0, -1.0), faceColors[1]);
    triangles[3] = Triangle(vertices[5], vertices[7], vertices[6], vec3(0.0, 0.0, -1.0), faceColors[1]);
    
    // 右 face (1,5,6,2)
    triangles[4] = Triangle(vertices[1], vertices[5], vertices[6], vec3(1.0, 0.0, 0.0), faceColors[2]);
    triangles[5] = Triangle(vertices[1], vertices[6], vertices[2], vec3(1.0, 0.0, 0.0), faceColors[2]);
    
    // 左 face (4,0,3,7)
    triangles[6] = Triangle(vertices[4], vertices[0], vertices[3], vec3(-1.0, 0.0, 0.0), faceColors[3]);
    triangles[7] = Triangle(vertices[4], vertices[3], vertices[7], vec3(-1.0, 0.0, 0.0), faceColors[3]);
    
    // 上 face (3,2,6,7)
    triangles[8] = Triangle(vertices[3], vertices[2], vertices[6], vec3(0.0, 1.0, 0.0), faceColors[4]);
    triangles[9] = Triangle(vertices[3], vertices[6], vertices[7], vec3(0.0, 1.0, 0.0), faceColors[4]);
    
    // 下 face (4,5,1,0)
    triangles[10] = Triangle(vertices[4], vertices[5], vertices[1], vec3(0.0, -1.0, 0.0), faceColors[5]);
    triangles[11] = Triangle(vertices[4], vertices[1], vertices[0], vec3(0.0, -1.0, 0.0), faceColors[5]);
}

// 计算天空背景色
vec3 getSkyColor(vec3 rayDir) {
    // 根据光线方向计算天空色（基于y分量的渐变）
    float t = 0.5 * (rayDir.y + 1.0); // 将y分量从[-1,1]映射到[0,1]
    vec3 skyColorBottom = vec3(0.529, 0.808, 0.922); // 浅蓝色（地平线上方）
    vec3 skyColorTop = vec3(0.102, 0.235, 0.451); // 深蓝色（天空顶部）
    return mix(skyColorBottom, skyColorTop, t);
}

// 光线追踪主函数
vec3 raytrace(vec3 ro, vec3 rd) {
    Triangle triangles[12];
    createCubeTriangles(triangles);
    
    // 创建旋转矩阵
    mat4 transform = rotateY(u_time * 0.5);
    
    // 初始化相交结果
    float minT = 10000.0;
    vec3 hitColor = vec3(0.0);
    vec3 hitNormal = vec3(0.0);
    bool foundHit = false;
    
    // 对每个三角形进行相交测试
    for (int i = 0; i < 12; i++) {
        // 应用旋转变换
        Triangle tri = triangles[i];
        tri.v0 = (transform * vec4(tri.v0, 1.0)).xyz;
        tri.v1 = (transform * vec4(tri.v1, 1.0)).xyz;
        tri.v2 = (transform * vec4(tri.v2, 1.0)).xyz;
        tri.normal = normalize((transform * vec4(tri.normal, 0.0)).xyz);
        
        // 计算相交
        Ray ray;
        ray.origin = ro;
        ray.direction = rd;
        
        Hit hit = rayTriangleIntersect(ray, tri);
        
        // 找到最近的交点
        if (hit.isHit && hit.t < minT) {
            minT = hit.t;
            hitColor = hit.color;
            hitNormal = hit.normal;
            foundHit = true;
        }
    }
    
    // 如果没有命中任何物体，返回天空背景色
    if (!foundHit) {
        return getSkyColor(rd);
    }
    
    return hitColor ;
}

// 修改正交投影函数
mat4 ortho(float left, float right, float bottom, float top, float near, float far) {
    return mat4(
        2.0/(right-left), 0.0, 0.0, -(right+left)/(right-left),
        0.0, 2.0/(top-bottom), 0.0, -(top+bottom)/(top-bottom),
        0.0, 0.0, -2.0/(far-near), -(far+near)/(far-near),
        0.0, 0.0, 0.0, 1.0
    );
}

void main() {
  // 设置正交投影参数
    float left = -5.0;
    float right = 5.0;
    float bottom = -5.5;
    float top = 5.5;
    float near = 1.;  // 近裁剪面
    float far = 10.0;  // 远裁剪面

    // 应用正交投影矩阵
    mat4 proj = ortho(left, right, bottom, top, near, far);
    // 计算屏幕坐标（从-1到1）
    vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / u_resolution.y;
    // vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    // uv = uv * 2.0 - 1.0;
    // uv.x *= u_resolution.x / u_resolution.y;
    
    // 设置相机参数
    vec3 ro = vec3(0.0, 0.0, 5.0); // 相机位置
    
    // 使用正交投影矩阵计算光线方向
    vec4 rayDir = proj * vec4(uv.x, uv.y, 1.0, 1.0);
    vec3 rd = normalize(rayDir.xyz);
    
    // 使用光线追踪渲染场景
    vec3 color = raytrace(ro, rd);
    
    // 输出最终颜色
    gl_FragColor = vec4(color, 1.0);
}