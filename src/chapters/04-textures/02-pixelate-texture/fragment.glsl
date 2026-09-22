uniform sampler2D tMap;
uniform vec2 uResolution;
uniform vec2 uTextureSize;

varying vec2 vUv;

void main() {
  vec2 uv = cover(vUv, uResolution, uTextureSize);

  float size = 70.0;

  // floor snaps each pixel to a cell, so a whole block reads the same texel.
  // Square cells on screen: cover() scales the two texture axes differently.
  vec2 cells = vec2(size * uResolution.x / uResolution.y, size);
  vec2 snapped = (floor(vUv * cells) + 0.5) / cells;

  gl_FragColor = texture2D(tMap, cover(snapped, uResolution, uTextureSize));
}
