// The terrain, as a function of any point on the unit sphere. Both shaders
// paste this in: the vertex shader lifts the surface with it, the fragment
// shader colours and lights the result from the same numbers.
//
// Needs fbm() from shaders/chunks/noise.glsl, pasted in front of this file.

uniform highp float uTime;
uniform highp float uAmplitude;

// Sea level. fbm hovers around 0, so lifting the waterline is what gives an
// ocean planet rather than a half-and-half one.
float height(vec3 p) {
  // A low frequency gives a few big continents rather than confetti.
  float h = fbm(p * 1.25 + uTime * 0.05) - 0.05;

  // Raw fbm is all rolling hills, everywhere. Squaring flattens the lowlands
  // and leaves the high ground standing, which is what reads as mountains.
  return h > 0.0 ? h * h * 3.0 : h;
}

// How far off the sphere the ground sits. Below sea level it is flat, and
// that max() is the whole coastline.
float lift(vec3 p) {
  return max(height(p), 0.0) * uAmplitude;
}

// The surface's own frame at a point: east and north. cross() collapses at the
// poles, where p is parallel to Y, so another axis is used there.
void frame(vec3 p, out vec3 east, out vec3 north) {
  vec3 axis = abs(p.y) > 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(0.0, 1.0, 0.0);

  east = normalize(cross(axis, p));
  north = cross(p, east);
}
