// snoise() and asteroidDrift() come from src/shaders/chunks.
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

// Per instance: resting offset, random, and this rock's texel in the state texture.
attribute vec3 offset;
attribute float random;
attribute vec2 dataUv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;

// The simulation output from the previous frame, read in the vertex shader.
uniform sampler2D tState;

varying vec2 vUv;
varying vec3 vNormal;
varying float vRandom;
varying float vFog;

mat3 rotationY(float angle) {
  return mat3(cos(angle), 0.0, -sin(angle), 0.0, 1.0, 0.0, sin(angle), 0.0, cos(angle));
}

void main() {
  vec4 state = texture2D(tState, dataUv);

  // Tumble plus the extra spin from the simulation (state.w).
  mat3 spin = rotationY(uTime * (0.2 + random * 0.7) + random * 6.28 + state.w);

  float radius = length(offset.xz);
  mat3 orbit = rotationY(uTime * (0.4 / radius));

  vec3 base = offset + asteroidDrift(offset, random, uTime);
  vec3 local = spin * position * (0.010 + random * 0.024);

  // The displacement is in world space, so it is added after the orbit.
  vec3 world = orbit * (local + base) + state.xyz;

  vec4 viewPosition = modelViewMatrix * vec4(world, 1.0);

  vFog = smoothstep(3.0, 7.5, -viewPosition.z);

  vUv = uv;
  vNormal = normalize(orbit * spin * normal);
  vRandom = random;

  gl_Position = projectionMatrix * viewPosition;
}
