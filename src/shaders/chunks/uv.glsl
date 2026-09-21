// UV helpers, pasted in front of every fullscreen shader alongside the palette.

/**
 * The shader equivalent of CSS `object-fit: cover`.
 * UVs always span 0 to 1 whatever the shape of the canvas, so an image drawn
 * straight from vUv is stretched. This rescales the coordinates around the
 * centre so the image keeps its own proportions and fills the frame.
 */
vec2 cover(vec2 uv, vec2 planeSize, vec2 imageSize) {
  vec2 ratio = vec2(
    min((planeSize.x / planeSize.y) / (imageSize.x / imageSize.y), 1.0),
    min((planeSize.y / planeSize.x) / (imageSize.y / imageSize.x), 1.0)
  );

  return (uv - 0.5) * ratio + 0.5;
}
