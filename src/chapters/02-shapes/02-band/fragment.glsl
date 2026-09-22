varying vec2 vUv;

void main() {
  // step(edge, x) is 0.0 before edge and 1.0 after; the difference of two is a band.
  float band = step(0.4, vUv.x) - step(0.6, vUv.x);

  vec3 color = mix(DARK, BLUE, band);

  gl_FragColor = vec4(color, 1.0);
}
