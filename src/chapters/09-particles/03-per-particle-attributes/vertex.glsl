attribute vec3 position;
attribute float random;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uPixelRatio;

varying float vRandom;

void main() {
  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);

  // The same formula as before, scaled by this particle's own number.
  gl_PointSize = (0.4 + random * 1.6) * 30.0 * uPixelRatio / -viewPosition.z;

  // Pass it along so the fragment shader can use it too.
  vRandom = random;

  gl_Position = projectionMatrix * viewPosition;
}
