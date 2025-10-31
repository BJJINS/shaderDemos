#version 300 es

{ { defines } }

in vec3 aPosition;

in vec3 aNormal;
out vec3 vNormal;

uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uModelMatrix;
// 灯光
// uniform vec4 uLightPosition;
// uniform float uShininess;
// uniform vec4 uAmbientProduct, uDiffuseProduct, uSpecularProduct;



#ifdef INSTANCED
in mat4 aInstanceMatrix;
#endif

#ifdef INSTANCED
#define MODEL_MATRIX (aInstanceMatrix * uModelMatrix)
#else
#define MODEL_MATRIX (uModelMatrix)
#endif

#define NORMAL_MATRIX (mat4(transpose(inverse(MODEL_MATRIX))))

void main() {
    gl_Position = uProjectionMatrix * uViewMatrix * MODEL_MATRIX * vec4(aPosition, 1.0);
}
