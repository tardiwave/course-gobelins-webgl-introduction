uniform sampler2D tMap;
uniform vec2 uResolution;
uniform vec2 uTextureSize;
uniform vec2 uMouse;

varying vec2 vUv;

void main() {
  float aspect = uResolution.x / uResolution.y;

  // Correct the pixel and the cursor the same way, or the circle becomes an ellipse.
  vec2 uv = vec2(vUv.x * aspect, vUv.y);
  vec2 mouse = vec2(uMouse.x * aspect, uMouse.y);

  float circle = smoothstep(0.2, 0.195, length(uv - mouse));

  vec3 color = texture2D(tMap, cover(vUv, uResolution, uTextureSize)).rgb;

  gl_FragColor = vec4(mix(color, BLUE, circle), 1.0);
}
