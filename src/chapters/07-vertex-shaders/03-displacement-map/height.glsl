// Needs fbm() from shaders/chunks/noise.glsl, pasted in front of this file.

uniform sampler2D tHeight;
uniform sampler2D tNoise;
uniform highp float uSource;
uniform highp float uTime;

// 2D noise on an equirectangular map tears at the seam, so noise is sampled on the sphere.
vec3 sphereAt(vec2 coords) {
  float phi = coords.x * 6.2831853;
  float theta = (1.0 - coords.y) * 3.14159265;

  return vec3(-cos(phi) * sin(theta), cos(theta), sin(phi) * sin(theta));
}

float height(vec2 coords) {
  // Elevation map. smoothstep, not max(), avoids a one-texel cliff along the coast.
  if (uSource < 0.5) {
    float raw = texture2D(tHeight, coords).r;

    return smoothstep(0.03, 0.2, raw) * raw;
  }

  // Any image, tiled.
  if (uSource < 1.5) {
    return texture2D(tNoise, coords * 2.0).r * 0.8;
  }

  // Procedural: fbm, sampled through the UV like the other two sources.
  return max(fbm(sphereAt(coords) * 1.6 + uTime * 0.05), 0.0) * 1.6;
}
