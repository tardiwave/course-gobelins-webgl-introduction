// Runs once per covered pixel and must write gl_FragColor.
precision mediump float;

// The GPU interpolates a varying across the triangle, hence the gradient.
varying vec2 vUv;

void main() {
  // Red is the horizontal coordinate, green the vertical one.
  gl_FragColor = vec4(vUv, 0.0, 1.0);
}
