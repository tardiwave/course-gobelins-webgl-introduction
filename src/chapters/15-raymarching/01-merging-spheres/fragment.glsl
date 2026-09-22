uniform float uTime;
uniform vec2 uResolution;
uniform float uBlend;
uniform vec2 uOrbit;

varying vec2 vUv;

const float PI = 3.14159265;

float sdSphere(vec3 p, float radius) {
  return length(p) - radius;
}

// Functions, because the shading needs the centres again after the hit.
vec3 centreA() {
  return vec3(-sin(uTime * 0.6) * 1.25, 0.0, 0.0);
}

vec3 centreB() {
  return vec3(sin(uTime * 0.6) * 1.25, sin(uTime * 0.9) * 0.15, 0.0);
}

// x: distance to the nearest surface. y: blend, 1 near the big sphere, 0 near the small.
vec2 map(vec3 p) {
  float a = sdSphere(p - centreA(), 0.75);
  float b = sdSphere(p - centreB(), 0.55);

  float k = uBlend;
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);

  return vec2(mix(b, a, h) - k * h * (1.0 - h), h);
}

// The gradient of the distance field is the normal.
vec3 normalAt(vec3 p) {
  vec2 e = vec2(0.0015, 0.0);

  return normalize(vec3(
    map(p + e.xyy).x - map(p - e.xyy).x,
    map(p + e.yxy).x - map(p - e.yxy).x,
    map(p + e.yyx).x - map(p - e.yyx).x
  ));
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  uv.x *= uResolution.x / uResolution.y;

  // Longitude and latitude of the camera, accumulated by dragging.
  float yaw = uOrbit.x;
  float pitch = clamp(uOrbit.y, -1.2, 1.2);

  vec3 origin = vec3(
    sin(yaw) * cos(pitch) * 4.2,
    sin(pitch) * 4.2,
    cos(yaw) * cos(pitch) * 4.2
  );

  vec3 forward = normalize(-origin);
  vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), forward));
  vec3 up = cross(forward, right);
  vec3 direction = normalize(forward * 1.7 + right * uv.x + up * uv.y);

  // Sphere tracing: step by the distance the field says is safe, so it never overshoots.
  float travelled = 0.0;
  float hit = -1.0;
  float blend = 0.0;

  for (int i = 0; i < 72; i++) {
    vec3 p = origin + direction * travelled;
    vec2 scene = map(p);

    if (scene.x < 0.002) {
      hit = travelled;
      blend = scene.y;
      break;
    }

    travelled += scene.x;

    if (travelled > 12.0) break;
  }

  vec3 color = DARK;

  if (hit > 0.0) {
    vec3 p = origin + direction * hit;
    vec3 normal = normalAt(p);

    // The blend colours the two volumes and cross-fades where they merge.
    vec3 ground = mix(GRAY * 0.7, BLUE, blend);

    vec3 light = normalize(vec3(0.6, 0.7, 0.4));
    float diffuse = max(dot(normal, light), 0.0);
    float fresnel = pow(1.0 - max(dot(normal, -direction), 0.0), 3.0);

    color = ground * (diffuse + 0.06);
    color += BLUE * fresnel * max(diffuse, 0.15);
  }

  gl_FragColor = vec4(color, 1.0);
}
