uniform sampler2D tScene;
uniform float uTime;
uniform float uAmount;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 offset = (vUv - 0.5) * 0.004;

  vec3 color = vec3(
    texture2D(tScene, vUv + offset).r,
    texture2D(tScene, vUv).g,
    texture2D(tScene, vUv - offset).b
  );

  // fract(uTime) reseeds the noise every frame, so the grain crawls instead
  // of sitting there as a static dirty overlay.
  float grain = hash(vUv + fract(uTime)) - 0.5;

  // Real grain lives in the midtones: none in the blacks, none in the blown
  // highlights. Sprayed evenly it reads as broadcast static instead of film.
  // The lower edge clears the background, which sits just above pure black.
  float luminance = dot(color, vec3(0.299, 0.587, 0.114));
  float window = smoothstep(0.08, 0.24, luminance) * smoothstep(1.0, 0.45, luminance);

  color += grain * uAmount * window;

  gl_FragColor = vec4(color, 1.0);
}
