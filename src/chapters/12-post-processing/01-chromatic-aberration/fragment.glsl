uniform sampler2D tScene;

varying vec2 vUv;

void main() {
  // A real lens does not focus every wavelength at the same distance, so the
  // three channels land slightly apart — more so away from the centre.
  vec2 offset = (vUv - 0.5) * 0.004;

  vec3 color = vec3(
    texture2D(tScene, vUv + offset).r,
    texture2D(tScene, vUv).g,
    texture2D(tScene, vUv - offset).b
  );

  gl_FragColor = vec4(color, 1.0);
}
