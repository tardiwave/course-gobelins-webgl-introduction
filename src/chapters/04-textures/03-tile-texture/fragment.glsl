uniform sampler2D tMap;
uniform vec2 uResolution;
uniform float uRepeat;
uniform float uBorders;

varying vec2 vUv;

void main() {
  // Aspect-corrected so tiles stay square: the wide axis gets more copies.
  vec2 uv = vUv * uRepeat * vec2(uResolution.x / uResolution.y, 1.0);

  // The texture uses REPEAT wrapping, so past 1.0 the sampler starts over.
  float n = texture2D(tMap, uv).r;

  vec3 color = mix(NIGHT, BLUE, smoothstep(0.05, 0.95, n));

  // A tile is uResolution.y / uRepeat pixels tall, so the lines stay 3 px thick.
  float width = 1.5 * uRepeat / uResolution.y;
  vec2 edge = abs(fract(uv) - 0.5);
  float border = max(step(0.5 - width, edge.x), step(0.5 - width, edge.y));

  gl_FragColor = vec4(mix(color, GRAY, border * uBorders * 0.6), 1.0);
}
