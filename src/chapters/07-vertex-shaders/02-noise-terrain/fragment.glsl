uniform vec3 uLight;

varying vec3 vNormal;
varying vec3 vTangent;
varying vec3 vBitangent;
varying vec3 vLocal;

// height(), lift() and frame() come from height.glsl, pasted in front of both shaders.

void main() {
  vec3 n = normalize(vLocal);

  vec3 east, north;
  frame(n, east, north);

  // Moving a vertex does not update its normal: measure the slope one step east and north.
  float step = 0.015;
  float here = lift(n);
  float slopeEast = (lift(normalize(n + east * step)) - here) / step;
  float slopeNorth = (lift(normalize(n + north * step)) - here) / step;

  // Per pixel, not per vertex: a varying is interpolated across a triangle and would show facets.
  vec3 tilt = vTangent * slopeEast + vBitangent * slopeNorth;
  vec3 normal = normalize(normalize(vNormal) - tilt);

  float elevation = height(n);

  vec3 deep = mix(NIGHT, BLUE, 0.25);
  vec3 color = mix(deep, BLUE, smoothstep(-0.22, -0.01, elevation));

  // A thin beach on the waterline.
  color = mix(color, mix(GRAY, CREAM, 0.6), smoothstep(-0.008, 0.006, elevation));

  color = mix(color, GRAY, smoothstep(0.004, 0.04, elevation));
  color = mix(color, CREAM, smoothstep(0.22, 0.45, elevation));

  float light = max(dot(normal, normalize(uLight)), 0.0);

  gl_FragColor = vec4(color * (light + 0.06), 1.0);
}
