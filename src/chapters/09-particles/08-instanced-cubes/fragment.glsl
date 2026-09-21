uniform vec3 uLight;

varying vec3 vNormal;
varying float vRandom;

void main() {
  // A cube has real faces, so it has real normals — which means it can be lit.
  // A point never could: it has no surface to speak of.
  float light = max(dot(normalize(vNormal), normalize(uLight)), 0.0);

  vec3 color = mix(GRAY * 0.4, CREAM, vRandom);

  gl_FragColor = vec4(color * (light + 0.08), 1.0);
}
