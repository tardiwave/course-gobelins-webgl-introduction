varying float vFront;

void main() {
  float front = smoothstep(-1.2, 1.2, vFront);

  gl_FragColor = vec4(CREAM, mix(0.15, 0.7, front));
}
