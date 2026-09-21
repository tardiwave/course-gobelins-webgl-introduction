attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vUv;
varying vec3 vLocal;

void main() {
  vUv = uv;

  // The position in the sphere's OWN space, before any rotation. This is what
  // lets the effect stay pinned to a place on the globe rather than to the
  // screen: the planet turns, this does not change.
  vLocal = normalize(position);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
