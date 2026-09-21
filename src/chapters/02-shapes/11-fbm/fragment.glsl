uniform vec2 uResolution;
uniform float uTime;

varying vec2 vUv;

// Two pseudo-random numbers from a cell corner. GLSL has no rand(), so every
// shader in the world hashes something — here a sine, stretched until its
// decimals stop being predictable.
vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));

  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

// Perlin noise: a random DIRECTION at each corner of a grid, and the value at
// a point is how much it agrees with the four corners around it.
float perlin(vec2 p) {
  vec2 cell = floor(p);
  vec2 local = fract(p);

  // Smootherstep, not smoothstep. Its second derivative is zero at the ends
  // too, which is what removes the grid from the result.
  vec2 blend = local * local * local * (local * (local * 6.0 - 15.0) + 10.0);

  float a = dot(hash(cell + vec2(0.0, 0.0)), local - vec2(0.0, 0.0));
  float b = dot(hash(cell + vec2(1.0, 0.0)), local - vec2(1.0, 0.0));
  float c = dot(hash(cell + vec2(0.0, 1.0)), local - vec2(0.0, 1.0));
  float d = dot(hash(cell + vec2(1.0, 1.0)), local - vec2(1.0, 1.0));

  return mix(mix(a, b, blend.x), mix(c, d, blend.x), blend.y);
}

// Fractal Brownian motion: the same noise added to itself at half the size
// and half the strength, five times over. Wide masses first, fine grain last.
float fbm(vec2 p) {
  float total = 0.0;
  float amplitude = 0.5;

  // GLSL ES 1.00 needs a loop count it can work out in advance, so this one
  // is a constant rather than a uniform.
  for (int i = 0; i < 5; i++) {
    total += perlin(p) * amplitude;

    p *= 2.0;
    amplitude *= 0.5;
  }

  return total;
}

void main() {
  vec2 uv = vUv;
  uv.x *= uResolution.x / uResolution.y;

  float n = fbm(uv * 3.0 + uTime * 0.08) * 1.4 + 0.5;

  gl_FragColor = vec4(mix(NIGHT, BLUE, smoothstep(0.2, 0.85, n)), 1.0);
}
