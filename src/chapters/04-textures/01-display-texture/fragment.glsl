uniform sampler2D tMap;
uniform vec2 uResolution;
uniform vec2 uTextureSize;

varying vec2 vUv;

void main() {
  // UVs span 0 to 1 whatever the canvas shape; cover() (src/shaders/chunks/uv.glsl) crops instead of stretching.
  vec2 uv = cover(vUv, uResolution, uTextureSize);

  // texture2D means "give me the colour of this image at this coordinate".
  gl_FragColor = texture2D(tMap, uv);
}
