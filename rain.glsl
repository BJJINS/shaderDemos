// 定义默认精度为mediump
precision mediump float;
// 雨滴最大半径
#define MAX_RADIUS 2

// 是否使用双重哈希来增强随机性 (0:禁用, 1:启用)
#define DOUBLE_HASH 0

// 哈希缩放因子，用于控制随机分布
#define HASHSCALE1 .1031
#define HASHSCALE3 vec3(.1031, .1030, .0973)

//  uniforms变量 - 从外部传入的参数
uniform vec2 u_resolution;  // 屏幕分辨率
uniform float u_time;       // 时间变量
uniform sampler2D u_texture_0; // 纹理采样器
uniform vec2 u_mouse;       // 鼠标位置

// 2D到1D哈希函数 - 生成伪随机数
// 参数p: 2D坐标
// 返回值: 0.0到1.0之间的随机数
float hash12(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * HASHSCALE1);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

// 2D到2D哈希函数 - 生成伪随机向量
// 参数p: 2D坐标
// 返回值: 0.0到1.0之间的2D随机向量
vec2 hash22(vec2 p) {
    // 将2D坐标转换为3D向量并应用哈希缩放
    vec3 p3 = fract(vec3(p.xyx) * HASHSCALE3);
    // 通过点积运算增强随机性
    p3 += dot(p3, p3.yzx + 19.19);
    // 生成并返回2D随机向量
    return fract((p3.xx + p3.yz) * p3.zy);
}

void main() {
    // 根据鼠标X位置调整分辨率缩放因子
    // float resolution = 10. * exp2(-3. * u_mouse.x / u_resolution.x);
    // 计算UV坐标，将屏幕坐标映射到雨滴网格
    vec2 uv = gl_FragCoord.xy / u_resolution.y * 10.0;
    // 获取当前网格单元坐标
    vec2 p0 = floor(uv);

    // 初始化雨滴方向向量
    vec2 circles = vec2(0.);
    // 在MAX_RADIUS范围内的网格上循环，寻找雨滴
    for (int j = -MAX_RADIUS; j <= MAX_RADIUS; ++j) {
        for (int i = -MAX_RADIUS; i <= MAX_RADIUS; ++i) {
            // 计算当前网格单元坐标
            vec2 pi = p0 + vec2(i, j);
            #if DOUBLE_HASH
            // 使用双重哈希增强随机性
            vec2 hsh = hash22(pi);
            #else
            // 使用简单哈希
            vec2 hsh = pi;
            #endif
            // 计算雨滴在网格内的随机位置
            vec2 p = pi + hash22(hsh);

            // 计算雨滴生命周期(0.0到1.0)
            float t = fract(0.3 * u_time + hash12(hsh));
            // 计算当前像素到雨滴中心的向量
            vec2 v = p - uv;
            // 计算带有时效性的距离场，t控制雨滴大小随时间变化
            float d = length(v) - (float(MAX_RADIUS) + 1.) * t;

            // 使用中心差分法计算距离场梯度，用于模拟雨滴法线
            float h = 1e-3;
            float d1 = d - h;
            float d2 = d + h;
            // 计算距离场在d1处的正弦波形值
            float p1 = sin(31. * d1) * smoothstep(-0.6, -0.3, d1) * smoothstep(0., -0.3, d1);
            // 计算距离场在d2处的正弦波形值
            float p2 = sin(31. * d2) * smoothstep(-0.6, -0.3, d2) * smoothstep(0., -0.3, d2);
            // 累加雨滴方向向量，(1-t)^2使雨滴随时间消失
            circles += 0.5 * normalize(v) * ((p2 - p1) / (2. * h) * (1. - t) * (1. - t));
        }
    }
    // 平均化所有雨滴贡献的方向向量
    circles /= float((MAX_RADIUS * 2 + 1) * (MAX_RADIUS * 2 + 1));

    // 计算雨滴强度，随时间平滑变化
    float intensity = mix(0.01, 0.15, smoothstep(0.1, 0.6, abs(fract(0.05 * u_time + 0.5) * 2. - 1.)));
    // 构建法向量，z分量由x和y分量计算得到
    vec3 n = vec3(circles, sqrt(1. - dot(circles, circles)));
    // 采样纹理并应用雨滴法线偏移，添加高光效果
    vec3 color = texture2D(u_texture_0, uv / 10.0 - intensity * n.xy).rgb + 5. * pow(clamp(dot(n, normalize(vec3(1., 0.7, 0.5))), 0., 1.), 6.);
    // 输出最终颜色
    gl_FragColor = vec4(color, 1.0);
}