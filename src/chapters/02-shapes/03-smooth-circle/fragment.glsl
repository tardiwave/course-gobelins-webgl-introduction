uniform vec2 uResolution;

varying vec2 vUv;

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;

  float radius = length(uv);

  // exp() never reaches zero, so there is no hard edge. Bigger factor, tighter glow.
  float circle = exp(-radius * 4.0);

  gl_FragColor = vec4(mix(DARK, CREAM, circle), 1.0);
}
