@export qmv.groundradial.vertex
@import clay.lambert.vertex
@end


@export qmv.groundradial.fragment

varying vec2 v_Texcoord;
varying vec3 v_Normal;
varying vec3 v_WorldPosition;

uniform vec4 color : [0.0, 0.0, 0.0, 0.0];
uniform vec4 gridColor: [0, 1, 1, 1];
uniform vec4 gridColor2: [0.8, 0.8, 0.8, 1];

uniform bool showGrid: true;

uniform float glossiness: 0.7;

@import clay.plugin.compute_shadow_map

void main()
{
    gl_FragColor = color;

    if (showGrid) {
        float wx = v_WorldPosition.x;
        float wz = v_WorldPosition.z;
        float x0 = abs(fract(wx / gridSize - 0.5) - 0.5) / fwidth(wx) * gridSize / 2.0;
        float z0 = abs(fract(wz / gridSize - 0.5) - 0.5) / fwidth(wz) * gridSize / 2.0;

        float x1 = abs(fract(wx / gridSize2 - 0.5) - 0.5) / fwidth(wx) * gridSize2;
        float z1 = abs(fract(wz / gridSize2 - 0.5) - 0.5) / fwidth(wz) * gridSize2;

        float v0 = 1.0 - clamp(min(x0, z0), 0.0, 1.0);
        float v1 = 1.0 - clamp(min(x1, z1), 0.0, 1.0);
        if (v0 > 0.1) {
            gl_FragColor = mix(gl_FragColor, gridColor, v0);
        }
        else {
            gl_FragColor = mix(gl_FragColor, gridColor2, v1);
        }
    }

    gl_FragColor.a *= 1.0 - clamp(length(v_WorldPosition.xz) / 30.0, 0.0, 1.0);
}

@end