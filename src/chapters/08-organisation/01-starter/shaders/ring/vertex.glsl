attribute vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying float vFront;

void main() {
  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
  vec4 viewCentre = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);

  // Positive on the half of the ring closer to the camera than its centre.
  vFront = viewPosition.z - viewCentre.z;

  gl_Position = projectionMatrix * viewPosition;
}
