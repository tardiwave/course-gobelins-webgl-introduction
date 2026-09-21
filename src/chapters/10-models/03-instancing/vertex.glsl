attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

// One per instance, not per vertex.
attribute vec3 offset;
attribute float random;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;
varying float vRandom;

mat3 rotationY(float angle) {
  return mat3(cos(angle), 0.0, -sin(angle), 0.0, 1.0, 0.0, sin(angle), 0.0, cos(angle));
}

void main() {
  // Each rock tumbles on itself…
  mat3 spin = rotationY(uTime * (0.2 + random * 0.7) + random * 6.28);

  // …and the whole belt turns, inner rocks faster than outer ones.
  float radius = length(offset.xz);
  mat3 orbit = rotationY(uTime * (0.4 / radius));

  vec3 local = spin * position * (0.010 + random * 0.024);

  vUv = uv;
  vNormal = normalize(orbit * spin * normal);
  vRandom = random;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(orbit * (local + offset), 1.0);
}
