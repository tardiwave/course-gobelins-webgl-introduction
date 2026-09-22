varying float vRandom;

void main() {
  // gl_PointCoord is 0 to 1 across the point sprite, no attribute needed.
  vec2 uv = gl_PointCoord * 2.0 - 1.0;

  float radius = length(uv);

  // A bigger exp() factor, because the sprite spans only a few pixels.
  float circle = exp(-radius * 5.0);

  float alpha = circle * (0.35 + vRandom * 0.65);

  // Discard the empty corners of the sprite.
  if (alpha < 0.02) discard;

  gl_FragColor = vec4(CREAM, alpha);
}
