precision highp float;

uniform sampler2D tScene;
uniform sampler2D tField;
uniform float uStrength;

varying vec2 vUv;

void main() {
  vec2 velocity = texture2D(tField, vUv).xy;

  // The scene is an image now, and an image can be read anywhere. Sampling
  // BACKWARDS along the velocity is what makes the picture appear to be
  // dragged forwards, along with the cursor.
  vec2 uv = vUv - velocity * uStrength;

  gl_FragColor = vec4(texture2D(tScene, uv).rgb, 1.0);
}
