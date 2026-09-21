attribute vec3 position;
attribute float random;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uPixelRatio;

varying float vRandom;

void main() {
  vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);

  // The same sizing rule as the belt, with a bigger constant: a hard square
  // reads on two pixels, a falloff needs room to fall off.
  //
  // gl_PointSize counts FRAMEBUFFER pixels, not CSS pixels. Without the ratio
  // the stars come out half size on a retina screen — and only there, which
  // makes it a bug you never see on your own machine.
  gl_PointSize = (0.4 + random * 1.2) * 160.0 * uPixelRatio / -viewPosition.z;

  vRandom = random;

  gl_Position = projectionMatrix * viewPosition;
}
