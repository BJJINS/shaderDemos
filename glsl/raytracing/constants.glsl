// 光
vec3 lightColor = vec3(1.0);
vec3 lightPos = vec3(5.0, 5.0, -1.0);

// 添加地面平面定义
vec4 groundPlane = vec4(0.0, 1.0, 0.0, 1.0); // y=1.0 的平面（法线向上，偏移量为1.0）
vec3 groundColor = vec3(177, 207, 135) / 255.0; // 白色地面

// 射线
vec3 rayOrigin = vec3(0.0, 5.0, 3.0); // 相机位置
vec3 target = vec3(0.0, 0.0, -5.0);

// 正方体
Box boxes[1] = Box[1](
        Box(vec3(0.0, 0.0, -4.0), vec3(1.0), vec3(148, 147, 150) / 255.0)
    );

// 球体
Sphere spheres[2] = Sphere[2](
        Sphere(vec3(2.0, 0.0, -4.0), 1.0, vec3(.875, .286, .333)),
        Sphere(vec3(-2.0, 0.0, -4.0), 1.0, vec3(0.192, 0.439, 0.651))
    );
