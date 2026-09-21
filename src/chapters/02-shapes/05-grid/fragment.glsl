uniform vec2 uResolution;

varying vec2 vUv;

void main() {
  // The aspect correction of the previous step, or the cells stretch with
  // the window.
  vec2 uv = vUv * vec2(uResolution.x / uResolution.y, 1.0);

  // fract keeps only the decimal part, so one cell repeats 10 times.
  vec2 cell = fract(uv * 10.0);

  // A thin band on each edge of the cell, combined with max.
  float shape = max(step(0.94, cell.x), step(0.94, cell.y));

  vec3 color = mix(DARK, BLUE, shape);

  gl_FragColor = vec4(color, 1.0);
}
