// Layout of the debug thumbnails along the bottom edge of the frame.
// core/thumbnails.ts repeats these two numbers, so a click lands on the box
// you can actually see.

const float THUMB_SIZE = 0.16;
const float THUMB_GAP = 0.015;

// Where this pixel falls inside thumbnail `index`. Outside the box the result
// leaves the 0-1 range, which is what inThumbnail() tests for.
vec2 thumbnailUv(vec2 uv, float index, float count) {
  float total = count * THUMB_SIZE + (count - 1.0) * THUMB_GAP;
  vec2 corner = vec2(0.98 - total + index * (THUMB_SIZE + THUMB_GAP), 0.025);

  return (uv - corner) / THUMB_SIZE;
}

bool inThumbnail(vec2 local, float margin) {
  return local.x > -margin && local.x < 1.0 + margin
      && local.y > -margin && local.y < 1.0 + margin;
}
