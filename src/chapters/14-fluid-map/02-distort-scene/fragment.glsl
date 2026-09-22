precision highp float;

uniform sampler2D tScene;
uniform sampler2D tField;
uniform float uStrength;

varying vec2 vUv;

void main() {
  vec2 velocity = texture2D(tField, vUv).xy;

  // Sample backwards along the velocity to drag the image forwards.
  vec2 uv = vUv - velocity * uStrength;

  gl_FragColor = vec4(texture2D(tScene, uv).rgb, 1.0);
}
