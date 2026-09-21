// Runs once per covered pixel. Its only job is to fill gl_FragColor.
precision mediump float;

// Three vertices carried a UV, yet this is a smooth gradient: the GPU
// interpolates a varying across the triangle.
varying vec2 vUv;

void main() {
  // Red is the horizontal coordinate, green the vertical one.
  gl_FragColor = vec4(vUv, 0.0, 1.0);
}
