attribute vec3 position;
attribute float random;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uPixelRatio;

varying float vRandom;

void main() {
  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);

  // gl_PointSize is in framebuffer pixels: without the pixel ratio, stars are half size on retina.
  gl_PointSize = (0.4 + random * 1.2) * 160.0 * uPixelRatio / -viewPosition.z;

  vRandom = random;

  gl_Position = projectionMatrix * viewPosition;
}
