uniform sampler2D tMap;
uniform sampler2D tNormal;
uniform vec3 uLight;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vTangent;
varying vec3 vBitangent;
varying vec3 vView;

void main() {
  // Normal maps store directions remapped to 0..1: flat (0.5, 0.5, 1.0) becomes (0, 0, 1).
  vec3 mapped = texture2D(tNormal, vUv).rgb * 2.0 - 1.0;
  mapped.xy *= 0.55;

  // Map directions are relative to the surface: x east, y north, z straight out.
  vec3 surface = normalize(vNormal);
  vec3 normal = normalize(vTangent * mapped.x + vBitangent * mapped.y + surface * mapped.z);

  float light = max(dot(normal, normalize(uLight)), 0.0);

  vec3 color = texture2D(tMap, vUv).rgb * (light + 0.06);

  // Use the geometric normal: the silhouette belongs to the sphere, not the texture.
  float fresnel = pow(1.0 - max(dot(surface, normalize(vView)), 0.0), 3.0);
  color += BLUE * fresnel * light;

  gl_FragColor = vec4(color, 1.0);
}
