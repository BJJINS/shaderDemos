#version 300 es

{ { defines } }

in vec3 aPosition;

in vec3 aNormal;
out vec3 vNormal;
out vec3 vColor;

uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uModelMatrix;
// 灯光
uniform vec3 uLightPosition;
uniform float uShininess;
uniform vec3 uAmbientProduct, uDiffuseProduct, uSpecularProduct;

uniform vec3 uCameraPosition;

#ifdef INSTANCED
in mat4 aInstanceMatrix;
#endif

#ifdef INSTANCED
#define MODEL_MATRIX (aInstanceMatrix * uModelMatrix)
#else
#define MODEL_MATRIX (uModelMatrix)
#endif

void main() {
    mat3 normalMatrix = mat3(transpose(inverse(MODEL_MATRIX)));
    vec3 worldPos = (MODEL_MATRIX * vec4(aPosition, 1.0)).xyz;
    vec3 N = normalize(normalMatrix * aNormal);
    vec3 L = normalize(uLightPosition - worldPos);
    vec3 V = normalize(uCameraPosition - worldPos);
    vec3 H = normalize(L + V);
    float Kd = max(dot(N, L), 0.0);
    float Ks = (Kd > 0.0) ? pow(max(dot(N, H), 0.0), uShininess) : 0.0;
    vec3 specular = Ks * uSpecularProduct;

    vColor = uAmbientProduct + Kd * uDiffuseProduct + specular;
    gl_Position = uProjectionMatrix * uViewMatrix * MODEL_MATRIX * vec4(aPosition, 1.0);
}
