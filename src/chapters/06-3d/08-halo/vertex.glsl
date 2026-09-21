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

  vec3 n = normalize(position);
  vec3 axis = abs(n.y) > 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(0.0, 1.0, 0.0);
  vec3 t = normalize(cross(axis, n));
  vec3 b = cross(n, t);

  vFade = 1.0 - pow(abs(n.y), 6.0);

  vUv = uv;
  vNormal = normalize(mat3(modelMatrix) * n);
  vTangent = normalize(mat3(modelMatrix) * t);
  vBitangent = normalize(mat3(modelMatrix) * b);

  // The direction from this point back to the camera. The fresnel is about
  // the angle between it and the surface, so it has to be per-pixel.
  vView = normalize(cameraPosition - world.xyz);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
