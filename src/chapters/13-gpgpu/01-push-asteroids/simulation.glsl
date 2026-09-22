// src/shaders/chunks precision.glsl, noise.glsl and drift.glsl are pasted in front, in that order.

// xyz: resting offset, w: random. Written once.
uniform sampler2D tRest;

// xyz: displacement from rest, w: extra tumble. Rewritten every frame.
uniform sampler2D tState;

uniform vec3 uPoint;
uniform float uTime;
uniform float uDelta;
uniform float uPush;
uniform float uRadius;

varying vec2 vUv;

mat3 rotationY(float angle) {
  return mat3(cos(angle), 0.0, -sin(angle), 0.0, 1.0, 0.0, sin(angle), 0.0, cos(angle));
}

void main() {
  vec4 rest = texture2D(tRest, vUv);
  vec4 state = texture2D(tState, vUv);

  vec3 displacement = state.xyz;
  float spin = state.w;

  // Must match the vertex shader exactly: only the displacement is stored.
  float radius = length(rest.xz);
  vec3 base = rest.xyz + asteroidDrift(rest.xyz, rest.w, uTime);
  vec3 resting = rotationY(uTime * (0.4 / radius)) * base;

  vec3 away = resting + displacement - uPoint;
  float distance = length(away);

  float falloff = exp(-distance * distance * uRadius);
  vec3 direction = distance > 0.0001 ? away / distance : vec3(0.0, 1.0, 0.0);

  // Scale by uDelta, or the belt behaves differently on a 144 Hz screen.
  displacement *= exp(-uDelta * 2.2);
  displacement += direction * falloff * uPush * uDelta;

  // Clamp: in a feedback loop, a runaway value or NaN never leaves the texture.
  float travelled = length(displacement);
  if (travelled > 1.5) displacement *= 1.5 / travelled;

  // Pushed rocks tumble harder.
  spin += travelled * uDelta * 5.0;

  gl_FragColor = vec4(displacement, spin);
}
