#version 300 es

{{ defines }}

in vec3 aPosition;

#ifdef NORMAL
in vec3 aNormal;
out vec3 vNormal;
#endif

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

// vec4 ambient, diffuse ,specular;
