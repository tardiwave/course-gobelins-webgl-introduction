uniform sampler2D tScene;

varying vec2 vUv;

void main() {
  // The three channels drift apart towards the edges, like a lens.
  vec2 offset = (vUv - 0.5) * 0.004;

  vec3 color = vec3(
    texture2D(tScene, vUv + offset).r,
    texture2D(tScene, vUv).g,
    texture2D(tScene, vUv - offset).b
  );

  gl_FragColor = vec4(color, 1.0);
}
