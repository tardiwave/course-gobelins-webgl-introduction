uniform sampler2D tScene;
uniform sampler2D tBright;
uniform sampler2D tBloom;
uniform float uAmount;
uniform float uZoom;

varying vec2 vUv;

void main() {
  // One of the three blown up to full frame, because a thumbnail is too small
  // to judge a threshold by.
  if (uZoom > -0.5) {
    vec3 only = uZoom < 0.5
      ? texture2D(tScene, vUv).rgb
      : uZoom < 1.5 ? texture2D(tBright, vUv).rgb : texture2D(tBloom, vUv).rgb;

    gl_FragColor = vec4(only, 1.0);
    return;
  }

  vec3 sharp = texture2D(tScene, vUv).rgb;
  vec3 bloom = texture2D(tBloom, vUv).rgb;

  // Screen blend rather than addition. Adding pushes bright pixels past 1 and
  // clips them to white; screen approaches 1 without ever reaching it.
  vec3 color = 1.0 - (1.0 - sharp) * (1.0 - bloom * uAmount);

  // The three ingredients, small along the bottom edge. Click one to enlarge.
  vec2 slot = thumbnailUv(vUv, 0.0, 3.0);
  if (inThumbnail(slot, 0.03)) color = BLUE;
  if (inThumbnail(slot, 0.0)) color = texture2D(tScene, slot).rgb;

  slot = thumbnailUv(vUv, 1.0, 3.0);
  if (inThumbnail(slot, 0.03)) color = BLUE;
  if (inThumbnail(slot, 0.0)) color = texture2D(tBright, slot).rgb;

  slot = thumbnailUv(vUv, 2.0, 3.0);
  if (inThumbnail(slot, 0.03)) color = BLUE;
  if (inThumbnail(slot, 0.0)) color = texture2D(tBloom, slot).rgb;

  gl_FragColor = vec4(color, 1.0);
}
