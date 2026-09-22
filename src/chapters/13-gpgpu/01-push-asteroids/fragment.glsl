uniform sampler2D tMap;
uniform vec3 uLight;
uniform float uFog;

varying vec2 vUv;
varying vec3 vNormal;
varying float vRandom;
varying float vFog;

void main() {
  vec3 color = texture2D(tMap, vUv).rgb;

  color = mix(color * 0.65, color * 1.15, vRandom);

  float light = max(dot(normalize(vNormal), normalize(uLight)), 0.0);
  color *= light + 0.06;

  // Fade to the background colour, not black, so it reads as distance.
  color = mix(color, DARK, vFog * uFog);

  gl_FragColor = vec4(color, 1.0);
}
