uniform sampler2D tState;
uniform vec2 uResolution;
uniform float uZoom;

varying vec2 vUv;

void main() {
  bool zoomed = uZoom > -0.5;

  vec2 local = zoomed ? vUv : thumbnailUv(vUv, 0.0, 1.0);

  if (!zoomed && !inThumbnail(local, 0.03)) discard;

  if (!zoomed && !inThumbnail(local, 0.0)) {
    gl_FragColor = vec4(BLUE, 1.0);
    return;
  }

  // Letterboxed so each texel, one asteroid, stays square.
  float aspect = uResolution.x / uResolution.y;
  vec2 uv = vec2((local.x - 0.5) * aspect + 0.5, local.y);

  if (uv.x < 0.0 || uv.x > 1.0) {
    gl_FragColor = vec4(DARK, 1.0);
    return;
  }

  // Signed displacement, recentred on grey like a normal map and amplified.
  gl_FragColor = vec4(texture2D(tState, uv).xyz * 1.6 + 0.5, 1.0);
}
