uniform vec2 uResolution;

varying vec2 vUv;

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;

  // length gives the distance from this pixel to the centre.
  float distance = length(uv);

  // smoothstep is step with a soft edge, which avoids the staircase of pixels.
  // Note the reversed edges: we want 1.0 inside, 0.0 outside.
  float circle = smoothstep(0.35, 0.345, distance);

  vec3 color = mix(DARK, BLUE, circle);

  gl_FragColor = vec4(color, 1.0);
}
