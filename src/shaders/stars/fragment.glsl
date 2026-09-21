varying float vRandom;

void main() {
  // gl_PointCoord is the one coordinate a point does give you: 0 to 1 across
  // the sprite, with no attribute to set up. Recentre it and the smooth
  // circle of the drawing chapter drops straight in.
  vec2 uv = gl_PointCoord * 2.0 - 1.0;

  float radius = length(uv);

  // The same exp() falloff, with a bigger number because the sprite is small:
  // an exponent is only ever as sharp as the coordinate it is fed, and here
  // uv spans a few pixels rather than a whole canvas.
  float circle = exp(-radius * 5.0);

  float alpha = circle * (0.35 + vRandom * 0.65);

  // Nothing is left in the corners: no need to blend them.
  if (alpha < 0.02) discard;

  gl_FragColor = vec4(CREAM, alpha);
}
