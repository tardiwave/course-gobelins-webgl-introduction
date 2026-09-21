attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vTangent;
varying vec3 vBitangent;
varying vec3 vLocal;

// height(), lift() and frame() come from height.glsl.

void main() {
  // Feeding noise the position anchors the relief to the sphere instead of
  // letting it slide across: the surface itself is the coordinate.
  vec3 n = normalize(position);

  vec3 east, north;
  frame(n, east, north);

  // The one thing only a vertex shader can do: move the geometry.
  vec3 displaced = n + n * lift(n);

  vUv = uv;
  vLocal = n;

  // The frame travels to the fragment shader already rotated into the world,
  // so the shading there only has to say how much to tilt.
  vNormal = normalize(mat3(modelMatrix) * n);
  vTangent = normalize(mat3(modelMatrix) * east);
  vBitangent = normalize(mat3(modelMatrix) * north);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
