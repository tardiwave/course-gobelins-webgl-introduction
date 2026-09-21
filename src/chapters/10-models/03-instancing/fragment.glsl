uniform sampler2D tMap;
uniform vec3 uLight;

varying vec2 vUv;
varying vec3 vNormal;
varying float vRandom;

void main() {
  vec3 color = texture2D(tMap, vUv).rgb;

  // A little variety between rocks, so a thousand copies of one model do not
  // read as a thousand copies of one model.
  color = mix(color * 0.65, color * 1.15, vRandom);

  float light = max(dot(normalize(vNormal), normalize(uLight)), 0.0);

  gl_FragColor = vec4(color * (light + 0.06), 1.0);
}
