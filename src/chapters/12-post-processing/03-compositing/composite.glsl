uniform sampler2D tScene;
uniform sampler2D tBright;
uniform sampler2D tBloom;
uniform float uAmount;
uniform float uGrain;
uniform float uTime;
uniform float uZoom;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  if (uZoom > -0.5) {
    vec3 only = uZoom < 0.5
      ? texture2D(tScene, vUv).rgb
      : uZoom < 1.5 ? texture2D(tBright, vUv).rgb : texture2D(tBloom, vUv).rgb;

    gl_FragColor = vec4(only, 1.0);
    return;
  }

  // 1. chromatic aberration: three reads of the render, slightly apart
  vec2 offset = (vUv - 0.5) * 0.004;
  vec3 sharp = vec3(
    texture2D(tScene, vUv + offset).r,
    texture2D(tScene, vUv).g,
    texture2D(tScene, vUv - offset).b
  );

  // 2. bloom: the blurred texture, screened on top
  vec3 bloom = texture2D(tBloom, vUv).rgb;
  vec3 color = 1.0 - (1.0 - sharp) * (1.0 - bloom * uAmount);

  // 3. grain: last, so nothing after it can smooth it away
  float grain = hash(vUv + fract(uTime)) - 0.5;
  float luminance = dot(color, vec3(0.299, 0.587, 0.114));
  float window = smoothstep(0.08, 0.24, luminance) * smoothstep(1.0, 0.45, luminance);
  color += grain * uGrain * window;

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
