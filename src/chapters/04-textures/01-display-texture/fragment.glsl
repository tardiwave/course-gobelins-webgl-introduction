uniform sampler2D tMap;
uniform vec2 uResolution;
uniform vec2 uTextureSize;

varying vec2 vUv;

void main() {
  // Read straight from vUv and the map is stretched: UVs span 0 to 1 whatever
  // the shape of the canvas. Same problem as the aspect ratio step, now with
  // an image that has proportions of its own. cover() is in src/shaders/chunks/uv.glsl.
  vec2 uv = cover(vUv, uResolution, uTextureSize);

  // texture2D means "give me the colour of this image at this coordinate".
  gl_FragColor = texture2D(tMap, uv);
}
