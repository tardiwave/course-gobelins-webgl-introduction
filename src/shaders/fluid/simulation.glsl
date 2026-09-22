// chunks/precision.glsl is pasted in front of this file.

// A velocity in x and y for every texel of the screen.
uniform sampler2D tField;

// The cursor in 0-1 texture coordinates, and its speed in those units per second.
uniform vec2 uMouse;
uniform vec2 uVelocity;

uniform float uAspect;
uniform float uDelta;
uniform float uStrength;
uniform float uDecay;
uniform vec2 uTexel;

varying vec2 vUv;

void main() {
  // Advection: a fragment can only write to itself, so each texel looks
  // backwards along the velocity to see what was there a moment ago.
  vec2 velocity = texture2D(tField, vUv).xy;
  vec2 field = texture2D(tField, vUv - velocity * uDelta).xy;

  // A little diffusion, or advection sharpens the field into texel-sized blocks.
  vec2 blurred = 0.25 * (
      texture2D(tField, vUv + vec2(uTexel.x, 0.0)).xy
    + texture2D(tField, vUv - vec2(uTexel.x, 0.0)).xy
    + texture2D(tField, vUv + vec2(0.0, uTexel.y)).xy
    + texture2D(tField, vUv - vec2(0.0, uTexel.y)).xy
  );

  field = mix(field, blurred, 0.18);

  // The splat, aspect-corrected so it stays round.
  vec2 toMouse = (vUv - uMouse) * vec2(uAspect, 1.0);
  float splat = exp(-dot(toMouse, toMouse) * 260.0);

  field += uVelocity * splat * uDelta * uStrength;

  // Viscosity: without it the field never settles.
  field *= exp(-uDelta * uDecay);

  gl_FragColor = vec4(field, 0.0, 1.0);
}
