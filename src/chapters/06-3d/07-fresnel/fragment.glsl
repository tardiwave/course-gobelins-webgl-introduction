uniform sampler2D tMap;
uniform sampler2D tNormal;
uniform vec3 uLight;
uniform float uStrength;
uniform float uRim;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vTangent;
varying vec3 vBitangent;
varying vec3 vView;

void main() {
  vec3 mapped = texture2D(tNormal, vUv).rgb * 2.0 - 1.0;
  mapped.xy *= uStrength;

  vec3 surface = normalize(vNormal);
  vec3 normal = normalize(vTangent * mapped.x + vBitangent * mapped.y + surface * mapped.z);

  float light = max(dot(normal, normalize(uLight)), 0.0);

  vec3 color = texture2D(tMap, vUv).rgb * (light + 0.06);

  // 1.0 at the silhouette, 0.0 facing us; pow() tightens the rim.
  // Use the geometric normal, not the mapped one: the silhouette belongs to the sphere.
  float fresnel = pow(1.0 - max(dot(surface, normalize(vView)), 0.0), uRim);

  // Multiplied by light so the night side does not glow.
  color += BLUE * fresnel * light;

  gl_FragColor = vec4(color, 1.0);
}
