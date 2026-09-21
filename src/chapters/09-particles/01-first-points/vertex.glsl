attribute vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

void main() {
  // In POINTS mode the vertex shader has a second job: saying how big the
  // point is, in screen pixels. Nothing else will do it for you, and
  // forgetting it leaves you with a blank canvas.
  gl_PointSize = 5.0;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
