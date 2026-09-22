// Pasted in front of both the draw and the simulation shaders, so they agree.
// Needs snoise() from noise.glsl.

vec3 asteroidDrift(vec3 offset, float random, float time) {
  // Seeded from the resting place, so neighbours drift together.
  vec3 seed = vec3(offset.xz * 0.8, time * 0.12 + random * 20.0);

  // Out and back along the ring, then above and below its plane.
  float wander = snoise(seed);
  float rise = snoise(seed + 31.4);

  vec3 radial = normalize(vec3(offset.x, 0.0, offset.z));

  return radial * wander * 0.09 + vec3(0.0, rise * 0.05, 0.0);
}
