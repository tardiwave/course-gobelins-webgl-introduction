precision highp float;

uniform sampler2D tField;
uniform vec2 uResolution;
uniform float uZoom;

varying vec2 vUv;

vec3 fieldColor(vec2 uv) {
  vec2 velocity = texture2D(tField, uv).xy;

  float speed = length(velocity);

  vec3 color = mix(DARK, BLUE, clamp(speed * 1.6, 0.0, 1.0));

  return mix(color, CREAM, clamp(speed * 0.5 - 0.25, 0.0, 1.0));
}

void main() {
  bool zoomed = uZoom > -0.5;

  vec2 local = zoomed ? vUv : thumbnailUv(vUv, 0.0, 1.0);

  if (!zoomed && !inThumbnail(local, 0.03)) discard;

  if (!zoomed && !inThumbnail(local, 0.0)) {
    gl_FragColor = vec4(BLUE, 1.0);
    return;
  }

  // The field is a square texture, the frame is not.
  float aspect = uResolution.x / uResolution.y;
  vec2 uv = vec2((local.x - 0.5) * aspect + 0.5, local.y);

  if (uv.x < 0.0 || uv.x > 1.0) {
    gl_FragColor = vec4(DARK, 1.0);
    return;
  }

  gl_FragColor = vec4(fieldColor(uv), 1.0);
}
