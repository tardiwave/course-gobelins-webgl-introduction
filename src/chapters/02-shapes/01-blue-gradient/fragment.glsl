varying vec2 vUv;

void main() {
  // mix(a, b, 0.0) is a, mix(a, b, 1.0) is b; vUv.x goes 0.0 to 1.0 left to right.
  vec3 color = mix(NIGHT, BLUE, vUv.x);

  gl_FragColor = vec4(color, 1.0);
}
