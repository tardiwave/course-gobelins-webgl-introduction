// Runs once per vertex (three here) and must write gl_Position.
attribute vec2 position;
attribute vec2 uv;

// A varying is the bridge from the vertex shader to the fragment shader.
varying vec2 vUv;

void main() {
  vUv = uv;

  // position is already in clip space: -1 on the left, +1 on the right.
  gl_Position = vec4(position, 0.0, 1.0);
}
