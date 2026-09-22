uniform sampler2D tScene;

varying vec2 vUv;

void main() {
  vec3 color = texture2D(tScene, vUv).rgb;

  // A border per face, otherwise the cube has no silhouette against the black page.
  vec2 edge = min(vUv, 1.0 - vUv);
  float frame = 1.0 - smoothstep(0.004, 0.012, min(edge.x, edge.y));

  gl_FragColor = vec4(mix(color, BLUE, frame), 1.0);
}
