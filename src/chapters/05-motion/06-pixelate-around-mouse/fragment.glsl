uniform sampler2D tMap;
uniform vec2 uResolution;
uniform vec2 uTextureSize;
uniform vec2 uMouse;

varying vec2 vUv;

void main() {
  float aspect = uResolution.x / uResolution.y;

  vec2 uv = vec2(vUv.x * aspect, vUv.y);
  vec2 mouse = vec2(uMouse.x * aspect, uMouse.y);

  // The circle is a mask: 1.0 near the cursor, 0.0 away from it.
  float mask = smoothstep(0.25, 0.2, length(uv - mouse));

  vec2 base = cover(vUv, uResolution, uTextureSize);

  float size = 70.0;
  // Square cells on screen: cover() scales the two texture axes differently.
  vec2 cells = vec2(size * uResolution.x / uResolution.y, size);
  vec2 snapped = (floor(vUv * cells) + 0.5) / cells;
  vec2 pixelated = cover(snapped, uResolution, uTextureSize);

  // Mix the coordinates, not the colours, so the effect fades in.
  gl_FragColor = texture2D(tMap, mix(base, pixelated, mask));
}
