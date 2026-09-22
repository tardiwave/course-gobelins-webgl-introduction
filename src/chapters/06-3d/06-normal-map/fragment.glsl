uniform sampler2D tMap;
uniform sampler2D tNormal;
uniform vec3 uLight;
uniform float uStrength;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vTangent;
varying vec3 vBitangent;

void main() {
  // Normal maps store directions remapped to 0..1: flat (0.5, 0.5, 1.0) becomes (0, 0, 1).
  vec3 mapped = texture2D(tNormal, vUv).rgb * 2.0 - 1.0;
  mapped.xy *= uStrength;

  // Map directions are relative to the surface: x east, y north, z straight out.
  vec3 normal = normalize(vTangent * mapped.x + vBitangent * mapped.y + vNormal * mapped.z);

  float light = max(dot(normal, normalize(uLight)), 0.0);

  gl_FragColor = vec4(texture2D(tMap, vUv).rgb * (light + 0.06), 1.0);
}
