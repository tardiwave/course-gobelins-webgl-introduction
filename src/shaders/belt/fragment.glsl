uniform float uFog;

varying float vRandom;
varying float vFog;

void main() {
  vec3 color = mix(GRAY, CREAM, vRandom);

  // Fog is a mix driven by distance, nothing more. uFog stays 0 until the
  // depth-fog step switches it on.
  color = mix(color, DARK, vFog * uFog);

  gl_FragColor = vec4(color, 1.0);
}
