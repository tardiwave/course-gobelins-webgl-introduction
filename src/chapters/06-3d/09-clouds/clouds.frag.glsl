uniform sampler2D tClouds;
uniform sampler2D tNoise;
uniform vec3 uLight;
uniform float uTime;
uniform float uWarp;

varying vec2 vUv;
varying vec3 vNormal;

void main() {
  // The domain warp from the motion chapter, wrapped on a sphere: the noise is
  // never drawn, it decides WHERE to read the clouds. Two reads drifting at
  // different speeds disagree slightly, so the sheet swirls instead of sliding
  // past in one rigid piece. Whole-number scales keep it seamless at the back.
  float nx = texture2D(tNoise, vUv * 2.0 + uTime * 0.005).r;
  float ny = texture2D(tNoise, vUv * 2.0 - uTime * 0.007 + 0.37).r;

  vec2 offset = (vec2(nx, ny) - 0.5) * uWarp;

  // The layer also drifts east, a little faster than the ground below it.
  vec4 clouds = texture2D(tClouds, vUv + offset + vec2(uTime * 0.003, 0.0));

  float light = max(dot(normalize(vNormal), normalize(uLight)), 0.0);

  gl_FragColor = vec4(clouds.rgb, clouds.a * (light * 0.95 + 0.05));
}
