uniform vec2 uResolution;

varying vec2 vUv;

void main() {
  // Recentre the coordinates: the origin moves from the corner to the middle.
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;

  // abs folds the space in half, so we only have one corner to think about.
  vec2 distance = abs(uv) - 0.35;

  // Inside the square means inside on both axes, which max tests.
  float square = 1.0 - step(0.0, max(distance.x, distance.y));

  vec3 color = mix(DARK, BLUE, square);

  gl_FragColor = vec4(color, 1.0);
}
