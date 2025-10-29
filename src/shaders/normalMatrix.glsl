#ifdef NORMAL
mat4 normalMatrix = mat4(transpose(inverse(uModelMatrix)));
vNormal = normalMatrix * vec4(aNormal, 1.0).xyz;
#endif
