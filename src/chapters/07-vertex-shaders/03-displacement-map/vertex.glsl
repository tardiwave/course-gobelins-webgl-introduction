attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uAmplitude;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vTangent;
varying vec3 vBitangent;
varying vec3 vLocal;

// height() comes from height.glsl, pasted in front of both shaders.

void main() {
  vec3 n = normalize(position);

  // The surface's own frame: out, east, north. The fragment shader tilts the
  // normal inside it.
  vec3 axis = abs(n.y) > 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(0.0, 1.0, 0.0);
  vec3 east = normalize(cross(axis, n));
  vec3 north = cross(n, east);

  // texture2D in a VERTEX shader, which is what turns an image into geometry.
  vec3 displaced = n + n * height(uv) * uAmplitude;

  vUv = uv;
  vLocal = n;
  vNormal = normalize(mat3(modelMatrix) * n);
  vTangent = normalize(mat3(modelMatrix) * east);
  vBitangent = normalize(mat3(modelMatrix) * north);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
