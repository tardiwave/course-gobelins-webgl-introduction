// Edit this file and the page reloads by itself. Already wired:
//   vUv          pixel coordinates, 0 to 1
//   uTime        seconds since the page opened
//   uResolution  canvas size in pixels
//   uMouse       cursor position, 0 to 1
//   tNoise       a noise texture
// Palette: DARK, CREAM, BLUE, NIGHT, GRAY

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform sampler2D tNoise;

varying vec2 vUv;

void main() {
  gl_FragColor = vec4(BLUE, 1.0);
}
