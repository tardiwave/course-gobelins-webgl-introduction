attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;
uniform float uAmplitude;

varying vec2 vUv;
varying vec3 vNormal;
varying float vHeight;

void main() {
  // A wave travelling from pole to pole. Nothing here is new except where it
  // is written: the vertex shader, which until now only ever projected.
  float height = sin(position.y * 6.0 - uTime * 2.0);

  // Pushing along the normal is what makes a surface swell rather than slide.
  vec3 displaced = position + normal * height * uAmplitude;

  vUv = uv;
  vHeight = height;
  vNormal = normalize(mat3(modelMatrix) * normal);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
