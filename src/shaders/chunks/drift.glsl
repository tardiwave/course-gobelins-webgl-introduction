// The wobble every asteroid carries on top of its orbit.
//
// Two shaders have to agree on where a rock belongs: the one that draws it and
// the simulation that pushes it away from there. So the formula lives in one
// file, pasted in front of both.
//
// Needs snoise() from noise.glsl.

vec3 asteroidDrift(vec3 offset, float random, float time) {
  // Seeded from the rock's resting place, so neighbours wander together. That
  // is what makes it read as a current through the belt rather than as jitter.
  vec3 seed = vec3(offset.xz * 0.8, time * 0.12 + random * 20.0);

  // Out along the ring and back in, then above its plane and below.
  float wander = snoise(seed);
  float rise = snoise(seed + 31.4);

  vec3 radial = normalize(vec3(offset.x, 0.0, offset.z));

  return radial * wander * 0.09 + vec3(0.0, rise * 0.05, 0.0);
}
