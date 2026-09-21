varying vec3 vNormal;

uniform vec3 uLight;

void main() {
  float light = max(dot(normalize(vNormal), normalize(uLight)), 0.0);

  gl_FragColor = vec4(BLUE * (light + 0.08), 1.0);
}
