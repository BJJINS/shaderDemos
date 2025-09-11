float crossProduct(vec2 a, vec2 b) {
    return cross(vec3(a, 0.0), vec3(b, 0.0)).z;
}
bool isPointInTriangle(vec2 p, vec2 a, vec2 b, vec2 c) {
    vec2 ab = b - a;
    vec2 bc = c - b;
    vec2 ca = a - c;

    vec2 ap = p - a;
    vec2 bp = p - b;
    vec2 cp = p - c;

    float crossAB = crossProduct(ab, ap);
    float crossBC = crossProduct(bc, bp);
    float crossCA = crossProduct(ca, cp);

    return (crossAB > 0.0) && (crossBC > 0.0) && (crossCA > 0.0);
}
void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    uv = uv * 2.0 - 1.0;
    bool isIn = isPointInTriangle(uv, vec2(0.0, 0.0), vec2(0.5, 0.0), vec2(0.0, 0.5));
    vec3 color = mix(vec3(0.0), vec3(1.0), isIn ? 1.0 : 0.0);
    gl_FragColor = vec4(color, 1.0);
}
