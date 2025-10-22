#version 300 es
precision mediump float;

#define AA

out vec4 fragColor; // 着色器输出颜色

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

// Math





vec3 getPixel(in vec2 coord, float time) {
    vec2 uv = coord / u_resolution;
    uv *= 2.0 - 1.0;
    uv.x *= u_resolution.x / u_resolution.y;

    vec3 angle = vec3(sin(time * 3.0) * 0.1, sin(time) * 0.2 + 0.3, time);
    vec3 origin = vec3(0.0, 3.5, time * 5.0);
    vec3 direction = normalize(vec3(uv, -2.0));
    // 根据像素到屏幕中心的距离调整z分量，产生鱼眼/桶形畸变效果
    // 屏幕边缘的光线更倾斜，增强透视感
    // todo 数学原理？
    direction.z += length(uv) * 0.14;
    direction = normalize(direction);

    return vec3(0.0);
}

void main() {
    // 左右移动鼠标时，会看到动画速度或相位发生相应变化，实现了交互控制动画的效果。
    float time = u_time * 0.3 + u_mouse.x * 0.01;
    vec3 color = vec3(0.0);

    // 抗锯齿
    #ifdef AA
    for (int i = -1; i <= 1; i++) {
        for (int j = -1; j <= 1; j++) {
            vec2 uv = gl_FragCoord.xy + vec2(i, j) / 3.0;
            color += getPixel(uv, time);
        }
    }
    color /= 9.0;
    #else
    color = getPixel(gl_FragCoord.xy, time);
    #endif

    // 对颜色的每个通道（R、G、B）分别进行指数为 0.65 的幂运算
    // 0.65 这个值接近 1/1.5 的伽马校正系数，用于将线性空间的颜色转换到伽马空间，使颜色在显示器上显示更准确
    // 渲染出的颜色更符合人眼的感知特性，避免出现过暗或过亮的视觉效果。
    fragColor = vec4(pow(color, vec3(0.65)), 1.0);
}
