uniform sampler2D tMap;
uniform sampler2D tNoise;
uniform vec2 uResolution;
uniform vec2 uTextureSize;

varying vec2 vUv;

void main() {
  vec2 uv = cover(vUv, uResolution, uTextureSize);

  vec3 earth = texture2D(tMap, uv).rgb;

  // The noise is a mask, not a colour; * 0.5 samples a smaller area, so its grain is enlarged.
  float noise = texture2D(tNoise, vUv * 0.5).r;
  float clouds = smoothstep(0.45, 0.68, noise);

  vec3 color = mix(earth, CREAM, clouds);

  gl_FragColor = vec4(color, 1.0);
}
