attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 cameraPosition;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vTangent;
varying vec3 vBitangent;
varying vec3 vView;
varying float vFade;

void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);

  // On a unit sphere the local position IS the normal. From it we build the
  // two other axes of the surface's own frame: one pointing east, one north.
  // Those three vectors are what let a flat image describe a direction.
  vec3 n = normalize(position);

  // cross() collapses to zero right on the poles, where n is parallel to Y —
  // and normalize(vec3(0.0)) is NaN, which shows up as a black hole.
  // Another axis there keeps the frame defined.
  vec3 axis = abs(n.y) > 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(0.0, 1.0, 0.0);
  vec3 t = normalize(cross(axis, n));
  vec3 b = cross(n, t);

  // An equirectangular map is squeezed to nothing at the poles, so its detail
  // is meaningless there. We fade it out rather than trust it.
  vFade = 1.0 - pow(abs(n.y), 6.0);

  vUv = uv;
  vNormal = normalize(mat3(modelMatrix) * n);
  vTangent = normalize(mat3(modelMatrix) * t);
  vBitangent = normalize(mat3(modelMatrix) * b);
  vView = normalize(cameraPosition - world.xyz);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
