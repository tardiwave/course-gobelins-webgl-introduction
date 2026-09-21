varying float vRandom;

void main() {
  // The same number drives the colour. Every pixel of one point gets the same
  // value: a point has a single vertex, so there is nothing to interpolate.
  vec3 color = mix(BLUE, CREAM, vRandom);

  gl_FragColor = vec4(color, 1.0);
}
