precision highp float;

uniform sampler2D tScene;
uniform sampler2D tField;
uniform float uStrength;
uniform float uSpread;

varying vec2 vUv;

void main() {
  vec2 shift = texture2D(tField, vUv).xy * uStrength;

  // Three reads at three slightly different distances, one channel kept from
  // each. The direction and the amount come from the field, so the fringe
  // only appears where the image is actually moving.
  vec3 color = vec3(
    texture2D(tScene, vUv - shift * (1.0 + uSpread)).r,
    texture2D(tScene, vUv - shift).g,
    texture2D(tScene, vUv - shift * (1.0 - uSpread)).b
  );

  gl_FragColor = vec4(color, 1.0);
}
