#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415
#define TWO_PI 6.28318530718

uniform float u_time;
uniform vec2 u_resolution;

vec2 st = gl_FragCoord.xy / u_resolution.xy;
vec3 red = vec3(.66, .13, .15);
vec3 yellow = vec3(.99, .81, .3);
vec3 blue = vec3(.0, .36, .6);
vec3 white = vec3(.97, .95, .87);
vec3 black = vec3(.0, .0, .0);

float plot(float pct) {
  return smoothstep(pct - 0.02, pct, st.y) -
         smoothstep(pct, pct + 0.02, st.y);
}

vec2 remapSpace (vec2 offset) {
  vec2 newSpace = st - offset;
  newSpace.x *= u_resolution.x / u_resolution.y;
  return newSpace * 2. - 1.;
}

vec3 rect (vec2 center, vec2 dim, vec3 color) {
  vec2 limit = vec2(0.);
  vec2 fill   = vec2(0.);

  float hw = dim.x * .5;
  float hh = dim.y * .5;
  float thickness = .01;

  vec2 bl = vec2(center.x - hw, center.y - hh);
  vec2 tr = vec2(center.x + hw, center.y + hh);

  limit = step(bl, st) * (1.0 - step(tr, st));
  fill += limit;
  fill *= limit.x * limit.y;

  color = mix(vec3(.0), color, min(fill.x + fill.y, 1.));

  return color;
}

vec3 circle(vec2 center, float radius, vec3 color){
  vec2 dist = st - center;
  float borders = 1. - smoothstep(radius - (radius * 0.01), radius + (radius * 0.01), dot(dist, dist) * 4.0);
  return borders * color;
}

vec4 drawTableau () {
  vec3 result = vec3(0.);

  // red rectangles
  result += rect(vec2(.0, .92), vec2(.12, .18), red);
  result += rect(vec2(.0, .71), vec2(.12, .18), red);
  result += rect(vec2(.15, .92), vec2(.12, .18), red);
  result += rect(vec2(.15, .71), vec2(.12, .18), red);

  // yellow rects
  result += rect(vec2(1.03, .92), vec2(.12, .18), yellow);
  result += rect(vec2(1.03, .71), vec2(.12, .18), yellow);

  // blue rects
  result += rect(vec2(1.05, -0.02), vec2(.16, .18), blue);
  result += rect(vec2(0.86, -0.02), vec2(.16, .18), blue);

  // white rects

  result += rect(vec2(0.86, .92), vec2(.16, .18), white);
  result += rect(vec2(0.86, .71), vec2(.16, .18), white);

  result += rect(vec2(0.495, .92), vec2(.52, .18), white);
  result += rect(vec2(0.495, .71), vec2(.52, .18), white);

  result += rect(vec2(.06, .29), vec2(.3, .6), white);
  result += rect(vec2(0.495, -0.02), vec2(.52, .18), white);

  result += rect(vec2(0.86, .345), vec2(.16, .495), white);
  result += rect(vec2(1.05, .345), vec2(.16, .495), white);

  result += rect(vec2(.495, .345), vec2(.52, .495), white);

  return vec4(result, 1.0);
}

vec3 drawBouncingBalls(int n) {
  vec3 res = vec3(.0);
  float shifty = 0.25 + 0.5;
  for (int i = 0; i < n; i += 1) {
    float shiftx = n * .1 - i * .1;
    res += circle(vec2(shiftx, shifty * abs(sin(u_time - i * 0.1))), clamp(abs(sin(u_time)), 0.05, i * 0.01), red);
    res += circle(vec2(shiftx, shifty * abs(cos(u_time - i * 0.2))), clamp(sin(u_time), 0.02, i * 0.01), yellow);
    res += circle(vec2(shiftx, shifty * abs(cos(u_time - i * 0.5))), 0.1 * (abs(cos(u_time))), blue);
  }
  return res;
}

vec3 drawPolarShapes () {
  vec3 color = vec3(0.);

  vec2 pos = vec2(0.5) - st;
  float r = length(pos) * 2.;
  float a = atan(pos.y, pos.x);

  float f = abs(cos(a * 3. + u_time)) * .5 + .3;

  color = 1. - smoothstep(f, f + .1, r);
  color *= red;

  f *= abs(cos(a * 6. + u_time - 10.)) * sin(u_time) * 0.3 + .3;
  color += (1. - smoothstep(f, f + .1, r)) * blue;

  f += sin(a * 3. - u_time * 5.) * .25;
  color += mix(color, black, step(r, 1. - smoothstep(f, f + .1, r)));

  // color = mix(color, blue, plot(f));

  return vec3(color);
}

vec3 drawSquareShapes (vec2 pos, int N, vec3 color, float size) {
  vec2 st = remapSpace(pos);
  float d = 0.;
  float a = atan(st.x, st.y) + PI + cos(u_time);
  float r = TWO_PI / float(N);

  d = cos(floor(.5 + a / r) * r - a ) * length(st);
  d *= size;
  return (1. - smoothstep(.4, .41, d)) * color;
}

vec3 drawMovingTriforce () {
  vec3 res = vec3(0.);
  vec3 ye = drawSquareShapes(vec2(sin(u_time) * 0.1, cos(u_time) * 0.1), 3, yellow, 4.);
  vec3 re = drawSquareShapes(vec2(sin(u_time - 10.) * 0.1, cos(u_time - 10.) * 0.1), 3, red, 4.);
  vec3 bl = drawSquareShapes(vec2(sin(u_time + 10.) * 0.1, cos(u_time - 20.) * 0.1), 3, blue, 4.);
  vec3 bl2 = drawSquareShapes(vec2(sin(u_time - 20.) * 0.1, cos(u_time - 30.) * 0.1), 3, blue, 4.);

  res += max(re, ye);
  res += bl;
  res += min(res, bl2);
  return res;
}

void main () {
  gl_FragColor = vec4(drawMovingTriforce(), 1.0);
}
