uniform float uFog;

varying float vRandom;
varying float vFog;

void main() {
  vec3 color = mix(GRAY, CREAM, vRandom);

  color = mix(color, DARK, vFog * uFog);

  gl_FragColor = vec4(color, 1.0);
}
