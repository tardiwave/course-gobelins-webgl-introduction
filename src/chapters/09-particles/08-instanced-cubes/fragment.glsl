uniform vec3 uLight;

varying vec3 vNormal;
varying float vRandom;

void main() {
  float light = max(dot(normalize(vNormal), normalize(uLight)), 0.0);

  vec3 color = mix(GRAY * 0.4, CREAM, vRandom);

  gl_FragColor = vec4(color * (light + 0.08), 1.0);
}
