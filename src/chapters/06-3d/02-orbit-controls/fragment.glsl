varying vec2 vUv;

void main() {
  // Shows how the sphere is unfolded into UVs, and where the seam is.
  gl_FragColor = vec4(vUv, 0.0, 1.0);
}
