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
  // Per pixel, not per vertex: a varying is interpolated across a triangle and loses the mountains.
  vec2 texel = 3.0 / uMapSize;

  float slopeU = height(vUv + vec2(texel.x, 0.0)) - height(vUv - vec2(texel.x, 0.0));
  float slopeV = height(vUv + vec2(0.0, texel.y)) - height(vUv - vec2(0.0, texel.y));

  // Slopes are in image space: divide by the real arc of a texel, or the poles turn to noise.
  float parallel = max(sqrt(1.0 - vLocal.y * vLocal.y), 0.08);
  vec2 arc = vec2(2.0 * texel.x * 3.14159265 * parallel, texel.y * 3.14159265);

  // uRelief bends the shading independently of the displacement.
  vec3 tilt = (vTangent * (slopeU / arc.x) + vBitangent * (slopeV / arc.y)) * uRelief;

  // Cap the tilt so a cliff never folds the normal past the horizon (black gash).
  float steep = length(tilt);
  if (steep > 1.0) tilt /= steep;

  vec3 normal = normalize(normalize(vNormal) - tilt);

  float light = max(dot(normal, normalize(uLight)), 0.0);

  gl_FragColor = vec4(texture2D(tMap, vUv).rgb * (light + 0.06), 1.0);
}
