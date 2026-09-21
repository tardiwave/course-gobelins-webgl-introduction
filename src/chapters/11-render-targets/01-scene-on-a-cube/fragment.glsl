uniform sampler2D tScene;

varying vec2 vUv;

void main() {
  // Nothing clever: the scene is a texture like any other now.
  vec3 color = texture2D(tScene, vUv).rgb;

  // A border on each face. The scene's background is the same black as the
  // page, so without it the cube has no silhouette — and it makes the "every
  // face gets its own 0 to 1" visible.
  vec2 edge = min(vUv, 1.0 - vUv);
  float frame = 1.0 - smoothstep(0.004, 0.012, min(edge.x, edge.y));

  gl_FragColor = vec4(mix(color, BLUE, frame), 1.0);
}
