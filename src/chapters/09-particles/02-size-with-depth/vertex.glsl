attribute vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uPixelRatio;

void main() {
  // In view space the camera looks down -Z, so z is negative in front of it.
  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);

  // Perspective does not apply to gl_PointSize: divide by the distance by hand.
  gl_PointSize = 40.0 * uPixelRatio / -viewPosition.z;

  gl_Position = projectionMatrix * viewPosition;
}
