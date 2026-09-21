// palette.glsl asks for mediump, which is right for colours and wrong for a
// velocity. The last declaration wins, so this one takes over.
precision highp float;

uniform sampler2D tField;

varying vec2 vUv;

void main() {
  // What the field holds is two signed numbers per texel. There is nothing to
  // look at in them until you decide how to look.
  vec2 velocity = texture2D(tField, vUv).xy;

  float speed = length(velocity);

  vec3 color = mix(DARK, BLUE, clamp(speed * 1.6, 0.0, 1.0));
  color = mix(color, CREAM, clamp(speed * 0.5 - 0.25, 0.0, 1.0));

  gl_FragColor = vec4(color, 1.0);
}
