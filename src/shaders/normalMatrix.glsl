#ifdef NORMAL
mat4 normalMatrix = mat4(transpose(inverse(MODEL_MATRIX)));
vNormal = normalMatrix * vec4(aNormal, 1.0).xyz;
#endif
