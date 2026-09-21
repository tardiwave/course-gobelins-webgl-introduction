uniform sampler2D tMap;
uniform vec3 uLight;

varying vec2 vUv;
varying vec3 vNormal;

void main() {
  // The model came with UVs: whoever made it decided how its surface unwraps,
  // and the texture was painted against that decision. All we do is read it.
  vec3 color = texture2D(tMap, vUv).rgb;

  float light = max(dot(normalize(vNormal), normalize(uLight)), 0.0);

  gl_FragColor = vec4(color * (light + 0.08), 1.0);
}
