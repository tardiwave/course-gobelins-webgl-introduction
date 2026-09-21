uniform vec3 uLight;

varying vec3 vNormal;
varying vec3 vTangent;
varying vec3 vBitangent;
varying vec3 vLocal;

// height(), lift() and frame() come from height.glsl — the same file the
// vertex shader used.

void main() {
  vec3 n = normalize(vLocal);

  vec3 east, north;
  frame(n, east, north);

  // Moving a vertex does not move its normal, and there is no attribute to
  // fix because the terrain does not exist until the shaders run. So we ask
  // the surface itself: how much higher is the ground one step east, and one
  // step north?
  float step = 0.015;
  float here = lift(n);
  float slopeEast = (lift(normalize(n + east * step)) - here) / step;
  float slopeNorth = (lift(normalize(n + north * step)) - here) / step;

  // Tilt the sphere normal against the slope. Doing it per PIXEL rather than
  // per vertex is what removes the facets: a normal passed as a varying is
  // interpolated across a triangle, and this relief is finer than a triangle.
  vec3 tilt = vTangent * slopeEast + vBitangent * slopeNorth;
  vec3 normal = normalize(normalize(vNormal) - tilt);

  float elevation = height(n);

  // The same number that raised the ground also colours it: one function, no
  // texture, and the two can never disagree.
  vec3 deep = mix(NIGHT, BLUE, 0.25);
  vec3 color = mix(deep, BLUE, smoothstep(-0.22, -0.01, elevation));

  // A thin beach exactly on the waterline.
  color = mix(color, mix(GRAY, CREAM, 0.6), smoothstep(-0.008, 0.006, elevation));

  color = mix(color, GRAY, smoothstep(0.004, 0.04, elevation));
  color = mix(color, CREAM, smoothstep(0.22, 0.45, elevation));

  float light = max(dot(normal, normalize(uLight)), 0.0);

  gl_FragColor = vec4(color * (light + 0.06), 1.0);
}
