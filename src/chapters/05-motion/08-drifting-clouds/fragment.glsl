uniform sampler2D tMap;
uniform sampler2D tClouds;
uniform sampler2D tNoise;
uniform vec2 uResolution;
uniform vec2 uTextureSize;
uniform float uTime;

varying vec2 vUv;

void main() {
  vec2 uv = cover(vUv, uResolution, uTextureSize);

  vec3 ground = texture2D(tMap, uv).rgb;

  // How far the noise is allowed to push the layer around.
  // Set it to 0.0 and the clouds still scroll, but they stop swirling.
  float drift = 0.05;

  // Read twice, at two different places, moving at two different speeds.
  // Neighbouring pixels then disagree slightly, and the sheet folds instead
  // of sliding past in one piece.
  float nx = texture2D(tNoise, uv * 0.5 + uTime * 0.010).r;
  float ny = texture2D(tNoise, uv * 0.5 - uTime * 0.013 + 0.37).r;

  // Remapped from 0..1 to -0.5..0.5 so the push goes both ways.
  vec2 offset = (vec2(nx, ny) - 0.5) * drift;

  // The alpha layer of the texture chapter — only its coordinates changed.
  vec4 clouds = texture2D(tClouds, uv + offset + vec2(uTime * 0.004, 0.0));

  gl_FragColor = vec4(mix(ground, clouds.rgb, clouds.a), 1.0);
}
