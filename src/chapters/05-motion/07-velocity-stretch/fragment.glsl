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

  // Aspect-correct the velocity, then split it into direction and speed.
  vec2 travel = vec2(uVelocity.x * aspect, uVelocity.y);
  float speed = length(travel) * 0.23;
  vec2 direction = speed > 0.001 ? normalize(travel) : vec2(1.0, 0.0);

  // Shrink the offset along the travel direction, so the mask reaches further that way.
  offset -= direction * dot(offset, direction) * min(speed, 0.8);

  float mask = smoothstep(0.22, 0.17, length(offset));

  vec2 base = cover(vUv, uResolution, uTextureSize);

  float size = 70.0;
  // Square cells on screen: cover() scales the two texture axes differently.
  vec2 cells = vec2(size * uResolution.x / uResolution.y, size);
  vec2 snapped = (floor(vUv * cells) + 0.5) / cells;
  vec2 pixelated = cover(snapped, uResolution, uTextureSize);

  gl_FragColor = texture2D(tMap, mix(base, pixelated, mask));
}
