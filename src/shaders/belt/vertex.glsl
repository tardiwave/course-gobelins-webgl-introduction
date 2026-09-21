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

  // Inner particles go round faster than outer ones, the way a real ring
  // behaves. The radius is already in the position we generated.
  float radius = length(offset.xz);
  float angle = uTime * (0.5 / radius);
  float c = cos(angle);
  float s = sin(angle);
  offset.xz = vec2(offset.x * c - offset.z * s, offset.x * s + offset.z * c);

  vec4 viewPosition = modelViewMatrix * vec4(offset, 1.0);

  // How deep this particle sits, between the two distances we call near and
  // far. Nothing is done with it here — the fragment shader decides.
  vFog = smoothstep(3.0, 7.5, -viewPosition.z);

  gl_PointSize = (0.4 + random * 1.4) * 20.0 * uPixelRatio / -viewPosition.z;
  vRandom = random;

  gl_Position = projectionMatrix * viewPosition;
}
