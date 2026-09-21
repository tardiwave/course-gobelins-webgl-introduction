uniform sampler2D tState;
uniform vec2 uResolution;
uniform float uZoom;

varying vec2 vUv;

void main() {
  bool zoomed = uZoom > -0.5;

  vec2 local = zoomed ? vUv : thumbnailUv(vUv, 0.0, 1.0);

  // Outside the little box nothing is drawn at all and the scene shows through.
  if (!zoomed && !inThumbnail(local, 0.03)) discard;

  if (!zoomed && !inThumbnail(local, 0.0)) {
    gl_FragColor = vec4(BLUE, 1.0);
    return;
  }

  // The state texture is square and the frame is not, so it is letterboxed:
  // one texel has to stay square, because one texel is one asteroid.
  float aspect = uResolution.x / uResolution.y;
  vec2 uv = vec2((local.x - 0.5) * aspect + 0.5, local.y);

  if (uv.x < 0.0 || uv.x > 1.0) {
    gl_FragColor = vec4(DARK, 1.0);
    return;
  }

  // rgb is the displacement. It is signed, so it gets recentred on grey the
  // way a normal map is; the multiplier only makes small pushes visible.
  gl_FragColor = vec4(texture2D(tState, uv).xyz * 1.6 + 0.5, 1.0);
}
