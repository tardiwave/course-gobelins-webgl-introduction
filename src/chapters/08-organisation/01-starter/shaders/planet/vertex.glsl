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

void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);

  // On a unit sphere, position == normal. East and north are built from it.
  vec3 n = normalize(position);

  // Not normalized: its length drops to 0 at the poles, fading the map where the image is squashed.
  vec3 t = vec3(n.z, 0.0, -n.x);
  vec3 b = cross(n, t);

  vUv = uv;
  vNormal = mat3(modelMatrix) * n;
  vTangent = mat3(modelMatrix) * t;
  vBitangent = mat3(modelMatrix) * b;
  vView = normalize(cameraPosition - world.xyz);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
