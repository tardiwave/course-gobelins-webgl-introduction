attribute vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

void main() {
  // Required in POINTS mode: without a gl_PointSize nothing is drawn.
  gl_PointSize = 5.0;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
