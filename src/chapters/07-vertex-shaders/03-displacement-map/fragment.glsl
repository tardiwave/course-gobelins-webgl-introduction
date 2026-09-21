uniform sampler2D tMap;
uniform vec3 uLight;

uniform highp vec2 uMapSize;
uniform highp float uRelief;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vTangent;
varying vec3 vBitangent;
varying vec3 vLocal;

void main() {
  // Rebuilding the normal per PIXEL rather than per vertex is what keeps the
  // shading smooth: a normal passed as a varying is interpolated across a
  // triangle, and mountains are finer than that.
  vec2 texel = 3.0 / uMapSize;

  float slopeU = height(vUv + vec2(texel.x, 0.0)) - height(vUv - vec2(texel.x, 0.0));
  float slopeV = height(vUv + vec2(0.0, texel.y)) - height(vUv - vec2(0.0, texel.y));

  // Those slopes are in image space, and the image is stretched over the
  // sphere: a step in u covers a whole parallel at the equator and almost
  // nothing at the poles. Dividing by the arc each one really covers is what
  // stops the poles turning to noise.
  float parallel = max(sqrt(1.0 - vLocal.y * vLocal.y), 0.08);
  vec2 arc = vec2(2.0 * texel.x * 3.14159265 * parallel, texel.y * 3.14159265);

  // How far the slope may bend the normal, kept separate from the
  // displacement: the geometry can be subtle while the shading is not.
  vec3 tilt = (vTangent * (slopeU / arc.x) + vBitangent * (slopeV / arc.y)) * uRelief;

  // A ceiling, so a cliff never folds the normal past the horizon and turns
  // the face into a black gash.
  float steep = length(tilt);
  if (steep > 1.0) tilt /= steep;

  vec3 normal = normalize(normalize(vNormal) - tilt);

  float light = max(dot(normal, normalize(uLight)), 0.0);

  gl_FragColor = vec4(texture2D(tMap, vUv).rgb * (light + 0.06), 1.0);
}
