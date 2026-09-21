uniform sampler2D tMap;

varying vec2 vUv;

void main() {
  // The texture is equirectangular: its width wraps around the sphere,
  // its height goes from pole to pole.
  gl_FragColor = texture2D(tMap, vUv);
}
