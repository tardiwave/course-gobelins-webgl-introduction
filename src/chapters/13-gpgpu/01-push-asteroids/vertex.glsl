// snoise() and asteroidDrift() come from src/shaders/chunks.
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

// One per instance: the resting offset, the random, and which texel of the
// state texture belongs to this rock.
attribute vec3 offset;
attribute float random;
attribute vec2 dataUv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;

// The simulation's output, read here in the vertex shader. The displacement
// map read a picture this way; this texture was written by the GPU itself,
// one frame ago.
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

  // The tumble of the models chapter, plus whatever the simulation added.
  mat3 spin = rotationY(uTime * (0.2 + random * 0.7) + random * 6.28 + state.w);

  float radius = length(offset.xz);
  mat3 orbit = rotationY(uTime * (0.4 / radius));

  vec3 base = offset + asteroidDrift(offset, random, uTime);
  vec3 local = spin * position * (0.010 + random * 0.024);

  // Orbit first, displacement after: the simulation works in world space, so
  // a rock knocked out of the belt keeps drifting while the belt turns under
  // it, then slides back into the gap it left.
  vec3 world = orbit * (local + base) + state.xyz;

  vec4 viewPosition = modelViewMatrix * vec4(world, 1.0);

  vFog = smoothstep(3.0, 7.5, -viewPosition.z);

  vUv = uv;
  vNormal = normalize(orbit * spin * normal);
  vRandom = random;

  gl_Position = projectionMatrix * viewPosition;
}
