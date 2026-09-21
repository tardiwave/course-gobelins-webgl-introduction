attribute vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uPixelRatio;

void main() {
  // The position of the vertex once the camera has had its say. Its z is the
  // distance to the camera, negative because the camera looks down -Z.
  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);

  // gl_PointSize is in screen pixels, so perspective does not apply to it on
  // its own. Dividing by the distance is what we have to do by hand — exactly
  // what the projection matrix does for everything else.
  gl_PointSize = 40.0 * uPixelRatio / -viewPosition.z;

  gl_Position = projectionMatrix * viewPosition;
}
