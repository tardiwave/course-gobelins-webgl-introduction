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
  // Each rock spins on itself.
  mat3 spin = rotationY(uTime * (0.2 + random * 0.7) + random * 6.28);

  // The belt turns, inner rocks faster. Speed uses the resting radius,
  // so a rock that drifts outwards does not fall out of formation.
  float radius = length(offset.xz);
  mat3 orbit = rotationY(uTime * (0.4 / radius));

  // Noise nudges each rock in and out of the ring, and above and below it.
  vec3 base = offset + asteroidDrift(offset, random, uTime);

  vec3 local = spin * position * (0.010 + random * 0.024);

  vec4 viewPosition = modelViewMatrix * vec4(orbit * (local + base), 1.0);

  // 0 at near, 1 at far: the fragment shader uses it for fog.
  vFog = smoothstep(3.0, 7.5, -viewPosition.z);

  vUv = uv;
  vNormal = normalize(orbit * spin * normal);
  vRandom = random;

  gl_Position = projectionMatrix * viewPosition;
}
