varying vec3 vNormal;

void main() {
  // Remap -1..1 normals to 0..1 colours: red faces +X, green +Y, blue +Z.
  gl_FragColor = vec4(normalize(vNormal) * 0.5 + 0.5, 1.0);
}
