// snoise() and asteroidDrift() come from src/shaders/chunks, pasted in front.
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
varying float vFog;

mat3 rotationY(float angle) {
  return mat3(cos(angle), 0.0, -sin(angle), 0.0, 1.0, 0.0, sin(angle), 0.0, cos(angle));
}

void main() {
  // Each rock tumbles on itself…
  mat3 spin = rotationY(uTime * (0.2 + random * 0.7) + random * 6.28);

  // …and the whole belt turns, inner rocks faster than outer ones. The speed
  // is read from the RESTING radius, so a rock that wanders outwards does not
  // slow down and fall out of formation.
  float radius = length(offset.xz);
  mat3 orbit = rotationY(uTime * (0.4 / radius));

  // Nothing in space runs on a perfect circle. Noise nudges each rock in and
  // out of the ring and above and below it, slowly.
  vec3 base = offset + asteroidDrift(offset, random, uTime);

  vec3 local = spin * position * (0.010 + random * 0.024);

  vec4 viewPosition = modelViewMatrix * vec4(orbit * (local + base), 1.0);

  // The same depth reading as the belt, over the same two distances, so the
  // rocks fade out exactly like the particles they replaced.
  vFog = smoothstep(3.0, 7.5, -viewPosition.z);

  vUv = uv;
  vNormal = normalize(orbit * spin * normal);
  vRandom = random;

  gl_Position = projectionMatrix * viewPosition;
}
