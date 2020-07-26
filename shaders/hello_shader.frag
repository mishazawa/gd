#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415
#define TWO_PI 6.28318530718

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

vec4 changeColorOverTime () {
    return vec4(abs(sin(u_time * 0.5)), abs(sin(u_time * 1.0)), abs(sin(u_time * 1.5)), 1.0);
}
vec2 normalizeMouse () {
    return vec2(u_mouse.x/u_resolution.x, 1.0 - u_mouse.y/u_resolution.y);
}
vec2 normalizeResolution () {
  return gl_FragCoord.xy/u_resolution;
}

float plot(vec2 st, float pct) {
  return smoothstep(pct - 0.02, pct, st.y) -
         smoothstep(pct, pct + 0.02, st.y);
}

float line (vec2 st, float pct) {
  return smoothstep(pct - 0.2, pct, st.x) -
         smoothstep(pct, pct + 0.2, st.x);
}

vec4 displayGradient () {
    vec2 col = normalizeResolution();
    return vec4(0.0, col, 1.0);
}

vec4 displayGradientWithMouse () {
    return vec4(0.0, normalizeMouse(), 1.0);
}

vec4 displayGradientWithMouseAndTime () {
    vec2 col = normalizeMouse();
    return vec4(abs(sin(u_time * 0.5)), abs(sin(col.x * 1.0)), abs(sin(u_time * col.y)), 1.0);
}

vec4 displayGradientWithTime () {
  vec2 col = normalizeResolution();
  col.x *= u_resolution.x/u_resolution.y;
  return vec4(col.x, col.y, abs(sin(u_time)), 1.0);
}

vec4 displayPlot () {
  vec2 back = normalizeResolution();

  float y = smoothstep(0.2,abs(cos(u_time * 0.5)),back.x) - smoothstep(abs(sin(u_time * 0.5)),0.8,back.x);
  vec3 color = vec3(y);

  float pct = plot(back, y);

  color = (1.0 - pct) * color + pct * vec3(.0, 1.0, .0);
  return vec4(color, 1.0);
}

vec4 displayPlot2 () {
  vec2 back = normalizeResolution();

  float y = sin(u_time * PI * back.x) * 0.5 + 0.5;
  vec3 color = vec3(y);

  float pct = plot(back, y);

  color = (1.0 - pct) * color + pct * vec3(.0, 1.0, .0);
  return vec4(color, 1.0);
}

vec4 displayGuanabara() {
  /* Danilo Guanabara */
  const float BRIGHTNESS = .01;
  vec3 color = vec3(.0);
  vec2 uv = normalizeResolution();
  vec2 mirror = uv - .5;
  float len = length(mirror);

  for (int i = 0; i < 3; i+=1) {
    uv += mirror / len * (sin(u_time) + 1.) * abs(sin(len * 9. - u_time * 5.));
    color[i] = BRIGHTNESS / length(abs(mod(uv, 1.) - .1)); // scale
  }

  return vec4(color / len, u_time);
}

void main () {
    gl_FragColor = displayGuanabara();
}
