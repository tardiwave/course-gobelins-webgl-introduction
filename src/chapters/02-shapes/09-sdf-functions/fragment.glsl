uniform vec2 uResolution;
uniform float uTime;

varying vec2 vUv;

// An SDF returns the distance to a shape: negative inside, zero on the edge, positive outside.

float sdCircle(vec2 p, float radius) {
  return length(p) - radius;
}

float sdBox(vec2 p, vec2 size) {
  vec2 d = abs(p) - size;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

// Smooth union: blends two distances instead of cutting between them.
float smoothUnion(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

mat2 rotate(float angle) {
  float c = cos(angle);
  float s = sin(angle);

  return mat2(c, -s, s, c);
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;

  float t = uTime * 0.5;
  vec2 travel = vec2(cos(t) * 0.30, sin(t * 0.7) * 0.10);

  float circle = sdCircle(uv + travel, 0.22);
  float box = sdBox(rotate(t * 0.4) * (uv - travel), vec2(0.18));

  float k = 0.06 + 0.14 * (0.5 + 0.5 * sin(t * 0.9));

  float distance = smoothUnion(circle, box, k);

  // Rings make the distance field visible outside the shape.
  vec3 color = DARK + vec3(fract(distance * 12.0 - uTime * 0.4)) * 0.12;

  // The same distance, thresholded, fills the shape.
  color = mix(color, BLUE, smoothstep(0.004, 0.0, distance));

  gl_FragColor = vec4(color, 1.0);
}
