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