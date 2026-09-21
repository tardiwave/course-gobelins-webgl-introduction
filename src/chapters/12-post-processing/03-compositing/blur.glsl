uniform sampler2D tScene;
uniform vec2 uDirection;

varying vec2 vUv;

void main() {
  // A small gaussian: nine reads along one axis, weighted by distance.
  float weights[5];
  weights[0] = 0.227027;
  weights[1] = 0.194594;
  weights[2] = 0.121621;
  weights[3] = 0.054054;
  weights[4] = 0.016216;

  vec3 color = texture2D(tScene, vUv).rgb * weights[0];

  for (int i = 1; i < 5; i++) {
    vec2 offset = uDirection * float(i);
    color += texture2D(tScene, vUv + offset).rgb * weights[i];
    color += texture2D(tScene, vUv - offset).rgb * weights[i];
  }

  gl_FragColor = vec4(color, 1.0);
}
