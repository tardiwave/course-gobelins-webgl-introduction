varying vec2 vUv;

void main() {
  // The UV view of the first chapter, wrapped on a sphere: it shows how the
  // geometry is unfolded, and where the seam is.
  gl_FragColor = vec4(vUv, 0.0, 1.0);
}
