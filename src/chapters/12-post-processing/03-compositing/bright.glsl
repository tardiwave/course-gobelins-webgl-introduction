uniform sampler2D tScene;
uniform float uThreshold;

varying vec2 vUv;

void main() {
  vec3 color = texture2D(tScene, vUv).rgb;

  float luminance = dot(color, vec3(0.299, 0.587, 0.114));

  // Subtract the threshold rather than mask, or the glow gets a hard outline.
  float keep = max(luminance - uThreshold, 0.0) / max(luminance, 0.0001);

  gl_FragColor = vec4(color * keep, 1.0);
}
