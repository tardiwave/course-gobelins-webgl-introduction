varying vec3 vNormal;

void main() {
  // Normals go from -1 to 1, colours from 0 to 1, hence the remap.
  // Red means the surface faces +X, green +Y, blue +Z.
  gl_FragColor = vec4(normalize(vNormal) * 0.5 + 0.5, 1.0);
}
