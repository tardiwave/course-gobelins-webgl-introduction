uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uTime;
uniform float uFalloff;
uniform float uLoad;

varying vec2 vUv;

void main() {
  float aspect = uResolution.x / uResolution.y;

  vec2 uv = vUv;
  uv.x *= aspect;

  vec2 centre = uMouse;
  centre.x *= aspect;

  float circle = exp(-length(uv - centre) * uFalloff);

  // Deliberately wasteful. GLSL ES 1.00 needs a constant loop bound, so the
  // slider cannot change it — it breaks out early instead.
  float busy = 0.0;
  for (int i = 0; i < 128; i++) {
    if (float(i) >= uLoad) break;
    busy += sin(uv.x * float(i) * 12.0 + uTime) * cos(uv.y * float(i) * 9.0);
  }

  vec3 color = mix(DARK, BLUE, circle);
  color += CREAM * busy * 0.004;

  gl_FragColor = vec4(color, 1.0);
}
