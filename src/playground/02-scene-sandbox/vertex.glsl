attribute vec3 position;
attribute vec3 normal;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec3 vNormal;

void main() {
  vNormal = mat3(modelMatrix) * normal;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
