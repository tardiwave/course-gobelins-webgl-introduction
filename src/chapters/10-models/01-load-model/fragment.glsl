varying vec3 vNormal;

void main() {
  // Normals again, for the same reason as the 3D chapter: before trusting a model
  // you check that its surface points where you think it does.
  gl_FragColor = vec4(normalize(vNormal) * 0.5 + 0.5, 1.0);
}
