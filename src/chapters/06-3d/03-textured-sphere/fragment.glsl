uniform sampler2D tMap;

varying vec2 vUv;

void main() {
  // Equirectangular texture: width wraps around the sphere, height goes pole to pole.
  gl_FragColor = texture2D(tMap, vUv);
}
