uniform sampler2D tMap;
uniform vec3 uLight;
uniform float uAmbient;

varying vec2 vUv;
varying vec3 vNormal;

void main() {
  // 1.0 facing the light, 0.0 at the terminator; max() keeps the night side from going negative.
  float light = max(dot(normalize(vNormal), normalize(uLight)), 0.0);

  // Without the ambient term the night side is pure black.
  vec3 color = texture2D(tMap, vUv).rgb * (light + uAmbient);

  gl_FragColor = vec4(color, 1.0);
}
