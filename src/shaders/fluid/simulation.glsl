// chunks/precision.glsl is pasted in front of this file.

// A velocity in x and y for every texel of the screen.
uniform sampler2D tField;

// The cursor, in the same 0–1 coordinates as the texture, and how fast it is
// going in those coordinates per second.
uniform vec2 uPointer;
uniform vec2 uVelocity;

uniform float uAspect;
uniform float uDelta;
uniform float uStrength;
uniform float uDecay;
uniform vec2 uTexel;

varying vec2 vUv;

void main() {
  // ADVECTION, the one line that makes this a fluid rather than a fading
  // stain. A fragment can only write to itself, so nothing can be pushed
  // anywhere: instead each texel looks BACKWARDS along the velocity and asks
  // what was there a moment ago.
  vec2 velocity = texture2D(tField, vUv).xy;
  vec2 field = texture2D(tField, vUv - velocity * uDelta).xy;

  // A touch of diffusion. Advection alone sharpens its own gradients frame
  // after frame: go over the same spot twice and the field ends up with
  // structure at the size of one texel, which shows through the distortion as
  // blocks. Four neighbours, mixed in lightly, keep it smooth.
  vec2 blurred = 0.25 * (
      texture2D(tField, vUv + vec2(uTexel.x, 0.0)).xy
    + texture2D(tField, vUv - vec2(uTexel.x, 0.0)).xy
    + texture2D(tField, vUv + vec2(0.0, uTexel.y)).xy
    + texture2D(tField, vUv - vec2(0.0, uTexel.y)).xy
  );

  field = mix(field, blurred, 0.18);

  // The splat: the smooth circle of the drawing chapter, aspect-corrected so
  // it stays round on a wide canvas.
  vec2 toPointer = (vUv - uPointer) * vec2(uAspect, 1.0);
  float splat = exp(-dot(toPointer, toPointer) * 260.0);

  field += uVelocity * splat * uDelta * uStrength;

  // Viscosity, more or less. Without it the field never forgets, and a few
  // seconds of stirring leave the screen permanently churned.
  field *= exp(-uDelta * uDecay);

  gl_FragColor = vec4(field, 0.0, 1.0);
}
