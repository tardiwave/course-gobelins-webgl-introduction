uniform float uScale;
uniform vec3 uLight;

varying vec3 vNormal;
varying vec3 vView;

void main() {
  vec3 normal = normalize(-vNormal);

  float edge = 1.0 - max(dot(normal, normalize(vView)), 0.0);

  // Below this angle the planet is in front of the shell, so nothing shows.
  float inner = 1.0 - sqrt(1.0 - 1.0 / (uScale * uScale));
  float t = clamp((edge - inner) / (1.0 - inner), 0.0, 1.0);

  // Air thins out exponentially with altitude, and so does the light it
  // scatters — which is what separates an atmosphere from a painted ring.
  float glow = exp(-t * 6.5);

  vec3 color = mix(mix(BLUE, CREAM, 0.22), BLUE, t);

  // Careful here: `normal` was flipped so the shell could be reasoned about.
  // The question "is this bit of air in the sun?" is about which way the point
  // faces away from the planet, so it needs the ORIGINAL normal.
  float lit = smoothstep(-0.35, 0.35, dot(normalize(vNormal), normalize(uLight)));

  gl_FragColor = vec4(color, glow * 0.65 * lit);
}
