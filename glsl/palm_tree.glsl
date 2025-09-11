void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord.xy / iResolution.xy;
    vec2 q = uv - vec2(0.33, 0.7);
    vec3 col = mix(vec3(1.0, 0.4, 0.1), vec3(1.0, 0.8, 0.3), sqrt(uv.y));
    float r = 0.2 + 0.1 * cos(atan(q.y, q.x) * 10.0 + q.x * 10.0);
    col *= smoothstep(r, r + 0.01, length(q));
    r = 0.015;
    r += cos(q.y * 120.0) * 0.002;
    r += exp(uv.y * -50.0);
    col *= 1.0 - (1.0 - smoothstep(r, r + 0.002, abs(q.x - sin(q.y * 2.0) * 0.25))) * (1.0 - smoothstep(0.0, 0.01, q.y));
    fragColor = vec4(col, 1.0);
}
