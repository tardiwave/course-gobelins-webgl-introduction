varying float vRandom;

void main() {
  // A point has one vertex, so every pixel of it gets the same varying.
  vec3 color = mix(BLUE, CREAM, vRandom);

  gl_FragColor = vec4(color, 1.0);
}
