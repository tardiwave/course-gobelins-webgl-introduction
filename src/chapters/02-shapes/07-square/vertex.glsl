// Vertex shader shared by everything drawn fullscreen.
// It does two things only: place the triangle, and pass the UVs along.
attribute vec2 position;
attribute vec2 uv;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
