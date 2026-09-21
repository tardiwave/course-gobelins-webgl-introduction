uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uCells;
uniform float uFalloff;
uniform vec3 uTint;
uniform float uGrid;

varying vec2 vUv;

void main() {
  float aspect = uResolution.x / uResolution.y;

  vec2 uv = vUv;
  uv.x *= aspect;

  vec2 centre = uMouse;
  centre.x *= aspect;

  // Snapped to cells when the toggle is on: the floor() of the grid step.
  vec2 snapped = (floor(uv * uCells) + 0.5) / uCells;
  uv = mix(uv, snapped, uGrid);

  float circle = exp(-length(uv - centre) * uFalloff);

  gl_FragColor = vec4(mix(DARK, uTint, circle), 1.0);
}
