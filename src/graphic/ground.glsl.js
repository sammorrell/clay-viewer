export default "@export qmv.ground.vertex\n@import clay.lambert.vertex\n@end\n\n\n@export qmv.ground.fragment\n\nvarying vec2 v_Texcoord;\nvarying vec3 v_Normal;\nvarying vec3 v_WorldPosition;\n\nuniform vec4 color : [0.0, 0.0, 0.0, 0.0];\nuniform float gridSize: 5;\nuniform float gridSize2: 1;\nuniform vec4 gridColor: [1.0, 1.0, 1.0, 1.0];\nuniform vec4 gridColor2: [0.8, 0.8, 0.8, 1.0];\n\nuniform bool showGrid: true;\n\nuniform float glossiness: 0.7;\n\n#ifdef SSAOMAP_ENABLED\nuniform sampler2D ssaoMap;\nuniform vec4 viewport : VIEWPORT;\n#endif\n\n#ifdef AMBIENT_LIGHT_COUNT\n@import clay.header.ambient_light\n#endif\n#ifdef AMBIENT_SH_LIGHT_COUNT\n@import clay.header.ambient_sh_light\n#endif\n#ifdef DIRECTIONAL_LIGHT_COUNT\n@import clay.header.directional_light\n#endif\n\n@import clay.plugin.compute_shadow_map\n\nvoid main()\n{\n gl_FragColor = color;\n\n if (showGrid) {\n float wx = v_WorldPosition.x;\n float wz = v_WorldPosition.z;\n float x0 = abs(fract(wx / gridSize - 0.5) - 0.5) / fwidth(wx) * gridSize / 2.0;\n float z0 = abs(fract(wz / gridSize - 0.5) - 0.5) / fwidth(wz) * gridSize / 2.0;\n\n float x1 = abs(fract(wx / gridSize2 - 0.5) - 0.5) / fwidth(wx) * gridSize2;\n float z1 = abs(fract(wz / gridSize2 - 0.5) - 0.5) / fwidth(wz) * gridSize2;\n\n float v0 = 1.0 - clamp(min(x0, z0), 0.0, 1.0);\n float v1 = 1.0 - clamp(min(x1, z1), 0.0, 1.0);\n if (v0 > 0.1) {\n gl_FragColor = mix(gl_FragColor, gridColor, v0);\n }\n else {\n gl_FragColor = mix(gl_FragColor, gridColor2, v1);\n }\n }\n\n vec3 diffuseColor = vec3(0.0, 0.0, 0.0);\n\n#ifdef AMBIENT_LIGHT_COUNT\n for(int _idx_ = 0; _idx_ < AMBIENT_LIGHT_COUNT; _idx_++)\n {\n diffuseColor += ambientLightColor[_idx_];\n }\n#endif\n#ifdef AMBIENT_SH_LIGHT_COUNT\n for(int _idx_ = 0; _idx_ < AMBIENT_SH_LIGHT_COUNT; _idx_++)\n {{\n diffuseColor += calcAmbientSHLight(_idx_, v_Normal) * ambientSHLightColor[_idx_];\n }}\n#endif\n\n#ifdef DIRECTIONAL_LIGHT_COUNT\n#if defined(DIRECTIONAL_LIGHT_SHADOWMAP_COUNT)\n float shadowContribsDir[DIRECTIONAL_LIGHT_COUNT];\n if(shadowEnabled)\n {\n computeShadowOfDirectionalLights(v_WorldPosition, shadowContribsDir);\n }\n#endif\n for(int i = 0; i < DIRECTIONAL_LIGHT_COUNT; i++)\n {\n vec3 lightDirection = -directionalLightDirection[i];\n vec3 lightColor = directionalLightColor[i];\n\n float ndl = dot(v_Normal, normalize(lightDirection));\n\n float shadowContrib = 1.0;\n#if defined(DIRECTIONAL_LIGHT_SHADOWMAP_COUNT)\n if( shadowEnabled )\n {\n shadowContrib = shadowContribsDir[i];\n }\n#endif\n\n diffuseColor += lightColor * clamp(ndl, 0.0, 1.0) * shadowContrib;\n }\n#endif\n\n#ifdef SSAOMAP_ENABLED\n diffuseColor *= texture2D(ssaoMap, (gl_FragCoord.xy - viewport.xy) / viewport.zw).r;\n#endif\n\n gl_FragColor.rgb *= diffuseColor;\n\n gl_FragColor.a *= 1.0 - clamp(length(v_WorldPosition.xz) / 30.0, 0.0, 1.0);\n\n}\n\n@end";
