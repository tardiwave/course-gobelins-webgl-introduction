uniform sampler2D tMap;
uniform vec2 uResolution;
uniform vec2 uTextureSize;
uniform vec2 uMouse;

varying vec2 vUv;

void main() {
  float aspect = uResolution.x / uResolution.y;

  vec2 uv = vec2(vUv.x * aspect, vUv.y);
  vec2 mouse = vec2(uMouse.x * aspect, uMouse.y);

  // The circle of the previous step is no longer drawn: it becomes a mask,
  // 1.0 near the cursor and 0.0 away from it.
  float mask = smoothstep(0.25, 0.2, length(uv - mouse));

  vec2 base = cover(vUv, uResolution, uTextureSize);

  float size = 70.0;
  // A grid of squares ON SCREEN. Snapping the texture coordinates directly
  // would give rectangles, because the map is twice as wide as it is tall and
  // cover() rescales the two axes differently.
  vec2 cells = vec2(size * uResolution.x / uResolution.y, size);
  vec2 snapped = (floor(vUv * cells) + 0.5) / cells;
  vec2 pixelated = cover(snapped, uResolution, uTextureSize);

  // mix between the two sets of coordinates, so the effect fades in.
  gl_FragColor = texture2D(tMap, mix(base, pixelated, mask));
}
