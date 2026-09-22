// Keep these numbers in sync with utils/thumbnails.ts, or clicks miss the boxes.

const float THUMB_SIZE = 0.16;
const float THUMB_GAP = 0.015;

// Where this pixel falls inside thumbnail `index`: outside 0-1 means outside the box.
vec2 thumbnailUv(vec2 uv, float index, float count) {
  float total = count * THUMB_SIZE + (count - 1.0) * THUMB_GAP;
  vec2 corner = vec2(0.98 - total + index * (THUMB_SIZE + THUMB_GAP), 0.025);

  return (uv - corner) / THUMB_SIZE;
}

bool inThumbnail(vec2 local, float margin) {
  return local.x > -margin && local.x < 1.0 + margin
      && local.y > -margin && local.y < 1.0 + margin;
}
