varying vec2 vUv;

void main() {
  float vertical = step(0.46, vUv.x) - step(0.54, vUv.x);
  float horizontal = step(0.46, vUv.y) - step(0.54, vUv.y);

  // max is how you combine two shapes into one: it keeps whichever is lit.
  float shape = max(vertical, horizontal);

  vec3 color = mix(DARK, BLUE, shape);

  gl_FragColor = vec4(color, 1.0);
}
