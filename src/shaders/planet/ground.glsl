uniform sampler2D tMap;
uniform sampler2D tNormal;
uniform vec3 uLight;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vTangent;
varying vec3 vBitangent;
varying vec3 vView;
varying float vFade;

void main() {
  // A normal map stores directions, not colours: a flat area is (0.5, 0.5, 1.0),
  // which remaps to (0, 0, 1).
  vec3 mapped = texture2D(tNormal, vUv).rgb * 2.0 - 1.0;
  mapped.xy *= 0.55 * vFade;

  // Those directions are relative to the surface, so rebuild them onto the
  // sphere: x east, y north, z straight out.
  vec3 surface = normalize(vNormal);
  vec3 normal = normalize(vTangent * mapped.x + vBitangent * mapped.y + surface * mapped.z);

  float light = max(dot(normal, normalize(uLight)), 0.0);

  vec3 color = texture2D(tMap, vUv).rgb * (light + 0.06);

  // The GEOMETRIC normal here: the silhouette belongs to the sphere, not to
  // the texture painted on it.
  float fresnel = pow(1.0 - max(dot(surface, normalize(vView)), 0.0), 3.0);
  color += BLUE * fresnel * light;

  gl_FragColor = vec4(color, 1.0);
}
