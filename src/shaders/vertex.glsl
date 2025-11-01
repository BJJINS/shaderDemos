#version 300 es

{ { defines } }

in vec3 aPosition;

in vec3 aNormal;
out vec3 vNormal;
out vec3 vWorldPos;

uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uModelMatrix;



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
    vNormal = normalize(normalMatrix * aNormal);
    vWorldPos = (MODEL_MATRIX * vec4(aPosition, 1.0)).xyz;
    gl_Position = uProjectionMatrix * uViewMatrix * vec4(vWorldPos, 1.0);
}
