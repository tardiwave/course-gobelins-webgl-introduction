uniform float uTime;

varying vec2 vUv;

void main() {
  // The shader has no clock: JS sends uTime every frame, and fract loops it.
  float trip = fract(uTime * 0.25);

  // Start and end off screen, or the band visibly jumps when it loops.
  float width = 0.06;
  float position = mix(-width, 1.0 + width, trip);

  float band = step(abs(vUv.x - position), width);

  vec3 color = mix(DARK, BLUE, band);

  gl_FragColor = vec4(color, 1.0);
}
