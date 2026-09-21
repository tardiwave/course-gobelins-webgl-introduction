uniform vec2 uResolution;

varying vec2 vUv;

// One band per axis, multiplied: a pixel survives only where both are lit.
float square(vec2 uv, vec2 center, float size) {
  float x = step(center.x - size, uv.x) - step(center.x + size, uv.x);
  float y = step(center.y - size, uv.y) - step(center.y + size, uv.y);

  return x * y;
}

void main() {
  float aspect = uResolution.x / uResolution.y;

  // LEFT: 0.12 of the width is not 0.12 of the height, so the square is a
  // rectangle.
  float wrong = square(vUv, vec2(0.28, 0.5), 0.12);

  // RIGHT: stretch x around the shape's centre, and one unit means the same
  // number of pixels on both axes.

  vec2 uv = vec2((vUv.x - 0.72) * aspect + 0.72, vUv.y);
  float right = square(uv, vec2(0.72, 0.5), 0.12);

  vec3 color = mix(DARK, GRAY * 0.55, wrong);
  color = mix(color, BLUE, right);

  gl_FragColor = vec4(color, 1.0);
}
