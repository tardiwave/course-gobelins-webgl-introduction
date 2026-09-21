// This shader draws nothing you will ever look at. Its output is a texture of
// numbers, one texel per asteroid, and the next frame reads it back.
//
// precision.glsl, noise.glsl and drift.glsl, from src/shaders/chunks, are
// pasted in front of this file, in that order.

// Where each asteroid belongs: xyz is its resting offset, w is its random.
// Written once, never changed.
uniform sampler2D tRest;

// Where it actually is: xyz is how far it has been pushed from that resting
// place, w is how much extra it has tumbled. This is what we rewrite.
uniform sampler2D tState;

uniform vec3 uMouse;
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

  // The orbit and the drift stay formulas, evaluated exactly as the vertex
  // shader evaluates them. Only the displacement depends on history.
  float radius = length(rest.xz);
  vec3 base = rest.xyz + asteroidDrift(rest.xyz, rest.w, uTime);
  vec3 resting = rotationY(uTime * (0.4 / radius)) * base;

  vec3 away = resting + displacement - uMouse;
  float distance = length(away);

  float falloff = exp(-distance * distance * uRadius);
  vec3 direction = distance > 0.0001 ? away / distance : vec3(0.0, 1.0, 0.0);

  // Two forces and that is the whole simulation: the mouse pushes outwards,
  // and the displacement decays towards zero on its own. Both scale with
  // uDelta, or the belt behaves differently on a 144 Hz screen.
  displacement *= exp(-uDelta * 2.2);
  displacement += direction * falloff * uPush * uDelta;

  // A feedback loop always finds the case you did not plan for, and a NaN
  // here would never leave the texture.
  float travelled = length(displacement);
  if (travelled > 1.5) displacement *= 1.5 / travelled;

  // Pushed rocks tumble harder, and keep the orientation they end up with.
  spin += travelled * uDelta * 5.0;

  gl_FragColor = vec4(displacement, spin);
}
