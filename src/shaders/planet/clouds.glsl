uniform sampler2D tClouds;
uniform sampler2D tNoise;
uniform vec3 uLight;
uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;

void main() {
  // Domain warping: the noise decides where to read the clouds.
  // Whole-number scales keep it seamless at the back of the globe.
  float nx = texture2D(tNoise, vUv * 2.0 + uTime * 0.005).r;
  float ny = texture2D(tNoise, vUv * 2.0 - uTime * 0.007 + 0.37).r;

  // Past about 0.015 the bands smear into streaks.
  vec2 offset = (vec2(nx, ny) - 0.5) * 0.012;

  // The clouds drift east, a little faster than the ground.
  vec4 clouds = texture2D(tClouds, vUv + offset + vec2(uTime * 0.003, 0.0));

  float light = max(dot(normalize(vNormal), normalize(uLight)), 0.0);

  gl_FragColor = vec4(clouds.rgb, clouds.a * (light * 0.95 + 0.05));
}
