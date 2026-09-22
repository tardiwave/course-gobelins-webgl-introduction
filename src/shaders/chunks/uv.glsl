// Pasted in front of every fullscreen shader, after the palette.

// The shader equivalent of CSS `object-fit: cover`.
vec2 cover(vec2 uv, vec2 planeSize, vec2 imageSize) {
  vec2 ratio = vec2(
    min((planeSize.x / planeSize.y) / (imageSize.x / imageSize.y), 1.0),
    min((planeSize.y / planeSize.x) / (imageSize.y / imageSize.x), 1.0)
  );

  return (uv - 0.5) * ratio + 0.5;
}
