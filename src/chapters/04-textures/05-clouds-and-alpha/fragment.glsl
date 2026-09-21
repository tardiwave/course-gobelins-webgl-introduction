uniform sampler2D tMap;
uniform sampler2D tClouds;
uniform vec2 uResolution;
uniform vec2 uTextureSize;

varying vec2 vUv;

void main() {
  vec2 uv = cover(vUv, uResolution, uTextureSize);

  vec3 ground = texture2D(tMap, uv).rgb;

  // The fourth channel. texture2D always returned a vec4 — we had simply never
  // looked at .a, which here holds how thick the cloud is at that pixel.
  vec4 clouds = texture2D(tClouds, uv);

  // A mask we did not have to invent: it came with the image.
  gl_FragColor = vec4(mix(ground, clouds.rgb, clouds.a), 1.0);
}
