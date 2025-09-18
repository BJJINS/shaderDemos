// 光
vec3 lightColor = vec3(1.0);
vec3 lightPos = vec3(5.0, 5.0, -1.0);

// 添加地面平面定义
vec4 groundPlane = vec4(0.0, 1.0, 0.0, 1.0); // y=1.0 的平面（法线向上，偏移量为1.0）
vec3 groundColor = vec3(177, 207, 135) / 255.0; // 白色地面

// 射线
vec3 rayOrigin = vec3(0.0, 5.0, 3.0); // 相机位置
vec3 target = vec3(0.0, 0.0, -5.0);

// 背景颜色
vec3 backgroundColor = vec3(0.1, 0.1, 0.2);