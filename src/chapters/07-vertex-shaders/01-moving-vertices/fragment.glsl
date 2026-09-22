uniform sampler2D tMap;
uniform vec3 uLight;

varying vec2 vUv;
varying vec3 vNormal;
varying float vHeight;

void main() {
  float light = max(dot(normalize(vNormal), normalize(uLight)), 0.0);

  vec3 color = texture2D(tMap, vUv).rgb * (light + 0.06);

  // Tint by height so the wave reads even head on.
  color = mix(color, BLUE, smoothstep(0.2, 1.0, vHeight) * 0.35);

  gl_FragColor = vec4(color, 1.0);
}
