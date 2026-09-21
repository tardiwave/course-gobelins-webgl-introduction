uniform float uTime;

varying vec2 vUv;

void main() {
  // The shader has no idea that time passes: we send it uTime every frame.
  // fract keeps only the decimal part, so the trip repeats for ever.
  float trip = fract(uTime * 0.25);

  // Note the margins. Looping from 0.0 to 1.0 would reset the band while its
  // middle is still on screen, and you would see it jump. Starting just off
  // the left edge and ending just off the right lets it leave completely
  // before it comes back.
  float width = 0.06;
  float position = mix(-width, 1.0 + width, trip);

  // The exact same band as the drawing chapter, except its centre now moves.
  float band = step(abs(vUv.x - position), width);

  vec3 color = mix(DARK, BLUE, band);

  gl_FragColor = vec4(color, 1.0);
}
