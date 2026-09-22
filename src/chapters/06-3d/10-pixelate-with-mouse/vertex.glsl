attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vUv;
varying vec3 vLocal;

void main() {
  vUv = uv;

  // Position in the sphere's own space, so the effect stays pinned to the globe as it turns.
  vLocal = normalize(position);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
