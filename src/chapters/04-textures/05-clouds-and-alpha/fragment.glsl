uniform sampler2D tMap;
uniform sampler2D tClouds;
uniform vec2 uResolution;
uniform vec2 uTextureSize;

varying vec2 vUv;

void main() {
  vec2 uv = cover(vUv, uResolution, uTextureSize);

  vec3 ground = texture2D(tMap, uv).rgb;

  // .a holds how thick the cloud is at this pixel.
  vec4 clouds = texture2D(tClouds, uv);

  gl_FragColor = vec4(mix(ground, clouds.rgb, clouds.a), 1.0);
}
