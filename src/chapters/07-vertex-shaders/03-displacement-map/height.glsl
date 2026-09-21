// Where the relief comes from. Three sources, one signature: whatever you can
// express as a function of the UV can become geometry.
//
// Needs fbm() from shaders/chunks/noise.glsl, pasted in front of this file.

uniform sampler2D tHeight;
uniform sampler2D tNoise;
uniform highp float uSource;
uniform highp float uTime;

// The point of the unit sphere a UV lands on. The procedural source needs it,
// because 2D noise on an equirectangular map tears along the seam.
vec3 sphereAt(vec2 coords) {
  float phi = coords.x * 6.2831853;
  float theta = (1.0 - coords.y) * 3.14159265;

  return vec3(-cos(phi) * sin(theta), cos(theta), sin(phi) * sin(theta));
}

float height(vec2 coords) {
  // A real elevation map. The smoothstep is a beach: cutting the sea off with
  // a plain max() leaves a one-texel cliff all along the coast.
  if (uSource < 0.5) {
    float raw = texture2D(tHeight, coords).r;

    return smoothstep(0.03, 0.2, raw) * raw;
  }

  // Any image at all, tiled. Nothing about the code cares that this one was
  // never meant to be a planet.
  if (uSource < 1.5) {
    return texture2D(tNoise, coords * 2.0).r * 0.8;
  }

  // No image. The same fbm as the previous step, sampled through the UV so it
  // shares the signature of the other two.
  return max(fbm(sphereAt(coords) * 1.6 + uTime * 0.05), 0.0) * 1.6;
}
