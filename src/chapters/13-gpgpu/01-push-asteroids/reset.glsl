precision highp float;

// A render target starts with garbage: clear it before the first frame.
void main() {
  gl_FragColor = vec4(0.0);
}
