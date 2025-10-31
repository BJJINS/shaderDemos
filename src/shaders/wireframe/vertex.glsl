#version 300 es

{ { defines } }

in vec3 aPosition;

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
    gl_Position = uProjectionMatrix * uViewMatrix * MODEL_MATRIX * vec4(aPosition, 1.0);
}
