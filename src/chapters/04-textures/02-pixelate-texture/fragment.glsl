uniform sampler2D tMap;
uniform vec2 uResolution;
uniform vec2 uTextureSize;

varying vec2 vUv;

void main() {
  vec2 uv = cover(vUv, uResolution, uTextureSize);

  float size = 70.0;

  // Pixelating is not about the image: it is about the coordinates. floor
  // snaps every pixel into a cell, so a whole block ends up reading the same
  // point of the image.
  // A grid of squares ON SCREEN. Snapping the texture coordinates directly
  // would give rectangles, because the map is twice as wide as it is tall and
  // cover() rescales the two axes differently.
  vec2 cells = vec2(size * uResolution.x / uResolution.y, size);
  vec2 snapped = (floor(vUv * cells) + 0.5) / cells;

  gl_FragColor = texture2D(tMap, cover(snapped, uResolution, uTextureSize));
}
