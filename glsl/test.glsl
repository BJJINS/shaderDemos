/* 带阴影的光线追踪渲染旋转立方体 - 兼容OpenGL 2.0 (WebGL 1.0) */
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution; // 画布分辨率
uniform vec2 u_mouse; // 鼠标位置
uniform float u_time; // 时间

mat4 ortho(float left, float right, float bottom, float top, float near, float far) {
    float tx = -(right + left) / (right - left);
    float ty = -(top + bottom) / (top - bottom);
    float tz = -(far + near) / (far - near);

    return mat4(
        2.0 / (right - left), 0.0, 0.0, tx,
        0.0, 2.0 / (top - bottom), 0.0, ty,
        0.0, 0.0, -2.0 / (far - near), tz,
        0.0, 0.0, 0.0, 1.0
    );
}

// 旋转矩阵函数
mat3 rotateY(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat3(
        c, 0.0, s,
        0.0, 1.0, 0.0,
        -s, 0.0, c
    );
}

mat3 rotateX(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat3(
        1.0, 0.0, 0.0,
        0.0, c, -s,
        0.0, s, c
    );
}

// 正方形距离函数
float sdBox(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

// 场景距离函数
float scene(vec3 p) {
    // 应用旋转
    mat3 rotation = rotateY(u_time);
    vec3 rotatedP = rotation * p;
    
    // 正方形尺寸
    vec3 boxSize = vec3(1.0, 1.0, 1.0);
    return sdBox(rotatedP, boxSize);
}

// 法线计算
vec3 calcNormal(vec3 p) {
    vec2 e = vec2(0.001, 0.0);
    return normalize(vec3(
        scene(p + e.xyy) - scene(p - e.xyy),
        scene(p + e.yxy) - scene(p - e.yxy),
        scene(p + e.yyx) - scene(p - e.yyx)
    ));
}

// 光线步进
float rayMarch(vec3 ro, vec3 rd, float maxDist, float maxSteps) {
    float t = 0.0;
    for (int i = 0; i < 100; i++) {
        if (i >= int(maxSteps)) break;
        
        vec3 p = ro + rd * t;
        float dist = scene(p);
        
        if (dist < 0.001) {
            return t;
        }
        
        t += dist;
        if (t > maxDist) {
            break;
        }
    }
    return -1.0;
}

void main() {
    // 计算屏幕坐标（从-1到1）
    float aspect = u_resolution.x / u_resolution.y;
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv = uv * 2.0 - 1.0;
    uv.x *= aspect;

    // 使用正交投影矩阵的参数直接计算光线方向
    float left = -2.0;
    float right = 5.0;
    float bottom = -5.0;
    float top = 5.0;
    float near = 0.1;
    float far = 100.0;
    
    // 相机位置
    vec3 ro = vec3(0.0, 3.0, 7.0);
    
    // 直接计算正交投影的光线方向
    // 在正交投影中，所有光线都是平行的，方向为相机的前向方向
    vec3 rd = normalize(vec3(0.0, 0.0, -1.0));
    
    // 计算光线起点：根据UV坐标在投影平面上偏移
    vec3 rayStart = ro + vec3(uv.x * (right - left) * 0.5, 
                             uv.y * (top - bottom) * 0.5, 
                             0.0);
    
    // 光线追踪
    float t = rayMarch(rayStart, rd, 100.0, 100.0);
    
    if (t > 0.0) {
        // 命中物体
        vec3 p = rayStart + rd * t;
        vec3 normal = calcNormal(p);
        
        // 简单光照
        vec3 lightPos = vec3(2.0, 3.0, 2.0);
        vec3 lightDir = normalize(lightPos - p);
        float diff = max(dot(normal, lightDir), 0.0);
        
        // 简单阴影
        float shadow = 1.0;
        vec3 shadowRo = p + normal * 0.01;
        float shadowT = rayMarch(shadowRo, lightDir, length(lightPos - p), 50.0);
        if (shadowT > 0.0) {
            shadow = 0.3;
        }
        
        // 最终颜色（带阴影的漫反射）
        vec3 color = vec3(0.8, 0.5, 0.3) * diff * shadow;
        gl_FragColor = vec4(color, 1.0);
    } else {
        // 背景色
        gl_FragColor = vec4(0.1, 0.1, 0.1, 1.0);
    }
}