uniform sampler2D tMap;
uniform vec3 uLight;
uniform float uFog;

varying vec2 vUv;
varying vec3 vNormal;
varying float vRandom;
varying float vFog;

void main() {
  vec3 color = texture2D(tMap, vUv).rgb;

  // A little variety between rocks, so a thousand copies of one model do not
  // read as a thousand copies of one model.
  color = mix(color * 0.65, color * 1.15, vRandom);

  float light = max(dot(normalize(vNormal), normalize(uLight)), 0.0);
  color *= light + 0.06;

  // Fading into the background colour rather than to black is what makes the
  // far side of the belt read as distance instead of shadow.
  color = mix(color, DARK, vFog * uFog);

  gl_FragColor = vec4(color, 1.0);
}
