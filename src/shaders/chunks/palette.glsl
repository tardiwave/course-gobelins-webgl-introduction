// Course palette, taken from the Figma file.
// This file is pasted in front of every fragment shader, since GLSL has no
// #include — so changing the art direction means changing these five lines.

// Declared here because this file comes first in the fragment shader.
precision mediump float;

const vec3 DARK = vec3(0.055, 0.059, 0.067);  // #0e0f11
const vec3 CREAM = vec3(0.914, 0.902, 0.886); // #e9e6e2
const vec3 BLUE = vec3(0.220, 0.220, 1.000);  // #3838ff
const vec3 NIGHT = vec3(0.035, 0.035, 0.161); // #090929
const vec3 GRAY = vec3(0.686, 0.667, 0.635);  // #afaaa2
