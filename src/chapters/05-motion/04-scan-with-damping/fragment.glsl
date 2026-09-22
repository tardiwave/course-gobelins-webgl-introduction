uniform sampler2D tMap;
uniform vec2 uResolution;
uniform vec2 uTextureSize;
uniform vec2 uMouse;

varying vec2 vUv;

void main() {
  vec2 uv = cover(vUv, uResolution, uTextureSize);

  // Damped in JavaScript; the shader only sees the result.
  float position = uMouse.x;

  float width = 0.12;
  float band = smoothstep(width, width - 0.02, abs(vUv.x - position));

  float size = 70.0;
  // Square cells on screen: cover() scales the two texture axes differently.
  vec2 cells = vec2(size * uResolution.x / uResolution.y, size);
  vec2 snapped = (floor(vUv * cells) + 0.5) / cells;
  vec2 pixelated = cover(snapped, uResolution, uTextureSize);

  vec3 color = texture2D(tMap, mix(uv, pixelated, band)).rgb;

  float edge = smoothstep(0.004, 0.0, abs(abs(vUv.x - position) - width));
  color = mix(color, BLUE, edge);

  gl_FragColor = vec4(color, 1.0);
}
