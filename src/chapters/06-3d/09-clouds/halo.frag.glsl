uniform float uScale;
uniform vec3 uLight;
uniform float uFalloff;

varying vec3 vNormal;
varying vec3 vView;

void main() {
  // We are looking at the INSIDE of the shell, so its normals point away
  // from us. Flipping them lets the rest read like any other surface.
  vec3 normal = normalize(-vNormal);

  float edge = 1.0 - max(dot(normal, normalize(vView)), 0.0);

  // Below this angle the planet is in front of the shell, so nothing shows.
  float inner = 1.0 - sqrt(1.0 - 1.0 / (uScale * uScale));
  float t = clamp((edge - inner) / (1.0 - inner), 0.0, 1.0);

  // Air thins out exponentially with altitude, and so does the light it
  // scatters. That curve is what separates an atmosphere from a painted ring.
  float glow = exp(-t * uFalloff);

  vec3 color = mix(mix(BLUE, CREAM, 0.22), BLUE, t);

  // "Is this bit of air in the sun?" is about which way the point faces away
  // from the planet, so this one needs the ORIGINAL normal, not the flipped one.
  float lit = smoothstep(-0.35, 0.35, dot(normalize(vNormal), normalize(uLight)));

  gl_FragColor = vec4(color, glow * 0.65 * lit);
}
