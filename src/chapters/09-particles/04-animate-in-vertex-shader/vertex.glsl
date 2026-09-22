attribute vec3 position;
attribute float random;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uPixelRatio;
uniform float uTime;

varying float vRandom;

void main() {
  vec3 offset = position;

  // Speed from the random, start angle from the position: no loop on the CPU.
  float angle = uTime * (0.15 + random * 0.35);
  float c = cos(angle);
  float s = sin(angle);
  offset.xz = vec2(offset.x * c - offset.z * s, offset.x * s + offset.z * c);

  // Vertical bob, out of phase for every particle.
  offset.y += sin(uTime * 0.6 + random * 6.28) * 0.08;

  vec4 viewPosition = modelViewMatrix * vec4(offset, 1.0);

  gl_PointSize = (0.4 + random * 1.6) * 30.0 * uPixelRatio / -viewPosition.z;
  vRandom = random;

  gl_Position = projectionMatrix * viewPosition;
}
