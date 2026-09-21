varying vec2 vUv;

void main() {
  // mix blends two values: mix(a, b, 0.0) is a, mix(a, b, 1.0) is b.
  // vUv.x goes from 0.0 on the left to 1.0 on the right, so it drives the blend.
  vec3 color = mix(NIGHT, BLUE, vUv.x);

  gl_FragColor = vec4(color, 1.0);
}
