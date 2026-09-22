// Needs fbm() from shaders/chunks/noise.glsl, pasted in front of this file.

uniform highp float uTime;
uniform highp float uAmplitude;

float height(vec3 p) {
  // Low frequency = a few big continents. fbm hovers around 0, so -0.05 raises sea level.
  float h = fbm(p * 1.25 + uTime * 0.05) - 0.05;

  // Squaring flattens the lowlands and keeps the peaks standing.
  return h > 0.0 ? h * h * 3.0 : h;
}

// Height above the sphere; max() flattens everything below sea level.
float lift(vec3 p) {
  return max(height(p), 0.0) * uAmplitude;
}

// East and north at p. cross() collapses at the poles, so another axis is used there.
void frame(vec3 p, out vec3 east, out vec3 north) {
  vec3 axis = abs(p.y) > 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(0.0, 1.0, 0.0);

  east = normalize(cross(axis, p));
  north = cross(p, east);
}
