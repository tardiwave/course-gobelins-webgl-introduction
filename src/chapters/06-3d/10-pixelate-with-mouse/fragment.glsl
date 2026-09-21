uniform sampler2D tMap;
uniform vec3 uPoint;

varying vec2 vUv;
varying vec3 vLocal;

void main() {
  // Distance between two points on the sphere, measured straight through it.
  // Comparing directions rather than UVs avoids both traps of a UV map: the
  // seam down the back, and the pinch at the poles.
  float distance = length(normalize(vLocal) - uPoint);

  // The mask of the motion chapter, unchanged — it just lives on the surface now.
  float mask = smoothstep(0.6, 0.38, distance);

  // Twice as many cells across as down: an equirectangular map wraps 360
  // degrees horizontally and 180 vertically, so an even grid in UV would give
  // blocks twice as wide as they are tall.
  float size = 60.0;
  vec2 cells = vec2(size * 2.0, size);
  vec2 pixelated = (floor(vUv * cells) + 0.5) / cells;

  gl_FragColor = texture2D(tMap, mix(vUv, pixelated, mask));
}
