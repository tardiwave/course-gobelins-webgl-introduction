// palette.glsl sets mediump, too coarse for a velocity; the last declaration wins.
precision highp float;

uniform sampler2D tField;

varying vec2 vUv;

void main() {
  vec2 velocity = texture2D(tField, vUv).xy;

  float speed = length(velocity);

  vec3 color = mix(DARK, BLUE, clamp(speed * 1.6, 0.0, 1.0));
  color = mix(color, CREAM, clamp(speed * 0.5 - 0.25, 0.0, 1.0));

  gl_FragColor = vec4(color, 1.0);
}
