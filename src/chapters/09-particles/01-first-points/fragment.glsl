void main() {
  // The fragment shader runs once per pixel OF THE POINT. With no rounding
  // and no gl_PointCoord, a point stays what the GPU draws by default:
  // a square. That is the look we want here.
  gl_FragColor = vec4(CREAM, 1.0);
}
