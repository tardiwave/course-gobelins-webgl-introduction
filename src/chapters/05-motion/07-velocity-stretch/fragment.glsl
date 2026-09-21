uniform sampler2D tMap;
uniform vec2 uResolution;
uniform vec2 uTextureSize;
uniform vec2 uMouse;
uniform vec2 uVelocity;

varying vec2 vUv;

void main() {
  float aspect = uResolution.x / uResolution.y;

  vec2 uv = vec2(vUv.x * aspect, vUv.y);
  vec2 mouse = vec2(uMouse.x * aspect, uMouse.y);

  vec2 offset = uv - mouse;

  // The velocity is corrected like everything else, then split into
  // a direction and a speed.
  vec2 travel = vec2(uVelocity.x * aspect, uVelocity.y);
  float speed = length(travel) * 14.0;
  vec2 direction = speed > 0.001 ? normalize(travel) : vec2(1.0, 0.0);

  // We never deform the circle: we squash the space it is measured in.
  // Shrinking the offset along the direction of travel makes distant points
  // count as near ones, so the mask reaches further that way.
  offset -= direction * dot(offset, direction) * min(speed, 0.8);

  float mask = smoothstep(0.22, 0.17, length(offset));

  // The pixelation of the previous step is still here, untouched.
  // The only thing that changed is the shape of the mask driving it.
  vec2 base = cover(vUv, uResolution, uTextureSize);

  float size = 70.0;
  // A grid of squares ON SCREEN. Snapping the texture coordinates directly
  // would give rectangles, because the map is twice as wide as it is tall and
  // cover() rescales the two axes differently.
  vec2 cells = vec2(size * uResolution.x / uResolution.y, size);
  vec2 snapped = (floor(vUv * cells) + 0.5) / cells;
  vec2 pixelated = cover(snapped, uResolution, uTextureSize);

  gl_FragColor = texture2D(tMap, mix(base, pixelated, mask));
}
