uniform sampler2D tScene;
uniform float uThreshold;

varying vec2 vUv;

void main() {
  vec3 color = texture2D(tScene, vUv).rgb;

  float luminance = dot(color, vec3(0.299, 0.587, 0.114));

  // Keep only what is brighter than the threshold — and only the part ABOVE
  // it. Subtracting rather than masking is what stops the glow having a hard
  // outline exactly where the threshold happens to fall.
  float keep = max(luminance - uThreshold, 0.0) / max(luminance, 0.0001);

  gl_FragColor = vec4(color * keep, 1.0);
}
