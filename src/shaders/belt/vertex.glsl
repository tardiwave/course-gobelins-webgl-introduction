attribute vec3 position;
attribute float random;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uPixelRatio;
uniform float uTime;

varying float vRandom;
varying float vFog;

void main() {
  vec3 offset = position;

  // Inner particles orbit faster than outer ones, like a real ring.
  float radius = length(offset.xz);
  float angle = uTime * (0.5 / radius);
  float c = cos(angle);
  float s = sin(angle);
  offset.xz = vec2(offset.x * c - offset.z * s, offset.x * s + offset.z * c);

  vec4 viewPosition = modelViewMatrix * vec4(offset, 1.0);

  // 0 at near, 1 at far: the fragment shader uses it for fog.
  vFog = smoothstep(3.0, 7.5, -viewPosition.z);

  gl_PointSize = (0.4 + random * 1.4) * 20.0 * uPixelRatio / -viewPosition.z;
  vRandom = random;

  gl_Position = projectionMatrix * viewPosition;
}
