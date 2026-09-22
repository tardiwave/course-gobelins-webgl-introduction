uniform float uScale;
uniform vec3 uLight;
uniform float uFalloff;

varying vec3 vNormal;
varying vec3 vView;

void main() {
  // We see the inside of the shell (cullFace FRONT), so its normals face away: flip them.
  vec3 normal = normalize(-vNormal);

  float edge = 1.0 - max(dot(normal, normalize(vView)), 0.0);

  // Below this angle the planet hides the shell.
  float inner = 1.0 - sqrt(1.0 - 1.0 / (uScale * uScale));
  float t = clamp((edge - inner) / (1.0 - inner), 0.0, 1.0);

  // exp() falloff: air density drops exponentially with altitude.
  float glow = exp(-t * uFalloff);

  vec3 color = mix(mix(BLUE, CREAM, 0.22), BLUE, t);

  // Lighting needs the original normal, not the flipped one.
  float lit = smoothstep(-0.35, 0.35, dot(normalize(vNormal), normalize(uLight)));

  gl_FragColor = vec4(color, glow * 0.65 * lit);
}
