attribute vec3 position;
attribute vec2 uv;

// Both matrices are provided automatically by OGL.
uniform mat4 modelViewMatrix;  // object → camera
uniform mat4 projectionMatrix; // camera → screen

varying vec2 vUv;

void main() {
  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
