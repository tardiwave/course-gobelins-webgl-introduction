uniform sampler2D tMap;
uniform vec2 uResolution;
uniform float uRepeat;
uniform float uBorders;

varying vec2 vUv;

void main() {
  // Tiles have to stay square, so the wide axis gets more copies, not wider
  // ones.
  vec2 uv = vUv * uRepeat * vec2(uResolution.x / uResolution.y, 1.0);

  // Past 1.0 the sampler starts the image over, because this texture is
  // loaded with REPEAT on both axes. No fract() anywhere: the hardware wraps.
  float n = texture2D(tMap, uv).r;

  vec3 color = mix(NIGHT, BLUE, smoothstep(0.05, 0.95, n));

  // Where one copy ends and the next begins. One tile is uResolution.y /
  // uRepeat pixels tall, so this keeps the lines three pixels thick.
  float width = 1.5 * uRepeat / uResolution.y;
  vec2 edge = abs(fract(uv) - 0.5);
  float border = max(step(0.5 - width, edge.x), step(0.5 - width, edge.y));

  gl_FragColor = vec4(mix(color, GRAY, border * uBorders * 0.6), 1.0);
}
