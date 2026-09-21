precision highp float;

// A render target holds whatever was in that memory before. One pass of zeroes
// and the simulation can trust what it reads on its first frame.
void main() {
  gl_FragColor = vec4(0.0);
}
