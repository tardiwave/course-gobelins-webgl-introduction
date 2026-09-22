uniform sampler2D tMap;
uniform vec3 uPoint;

varying vec2 vUv;
varying vec3 vLocal;

void main() {
  // Compare directions, not UVs: avoids the seam and the pinch at the poles.
  float distance = length(normalize(vLocal) - uPoint);

  float mask = smoothstep(0.6, 0.38, distance);

  // Twice as many cells across: the map covers 360 degrees wide but 180 tall.
  float size = 60.0;
  vec2 cells = vec2(size * 2.0, size);
  vec2 pixelated = (floor(vUv * cells) + 0.5) / cells;

  gl_FragColor = texture2D(tMap, mix(vUv, pixelated, mask));
}
