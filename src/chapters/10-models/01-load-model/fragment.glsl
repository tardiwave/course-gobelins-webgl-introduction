varying vec3 vNormal;

void main() {
  // Show the normals to check the model's surface points where you expect.
  gl_FragColor = vec4(normalize(vNormal) * 0.5 + 0.5, 1.0);
}
