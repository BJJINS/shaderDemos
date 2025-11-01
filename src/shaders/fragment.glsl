#version 300 es
precision mediump float;

out vec4 fragColor;

in vec3 vNormal;
in vec3 vWorldPos;

uniform vec3 uLightPosition;
uniform vec3 uCameraPosition;

uniform float uShininess;
uniform vec3 uAmbientProduct, uDiffuseProduct, uSpecularProduct;

void main() {
    vec3 N = normalize(vNormal);
    vec3 L = normalize(uLightPosition - vWorldPos);
    vec3 V = normalize(uCameraPosition - vWorldPos);
    vec3 H = normalize(L + V);
    float Kd = max(dot(N, L), 0.0);
    float Ks = pow(max(dot(N, H), 0.0), uShininess) * step(0.0, Kd) * step(0.0, dot(N, V));
    vec3 specular = Ks * uSpecularProduct;
    float dist = length(uLightPosition - vWorldPos);
    float attenuation = 1.0 / (1.0 + 0.09 * dist + 0.032 * dist * dist);
    vec3 color = uAmbientProduct + attenuation * (Kd * uDiffuseProduct + specular);

    fragColor = vec4(color, 1.0);
}
