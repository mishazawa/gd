#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415
#define TWO_PI 6.28318530718

uniform float u_time;
uniform vec2 u_resolution;

vec2 normalizeResolution () {
  return gl_FragCoord.xy / u_resolution;
}

float rect(in vec2 st, in vec2 size){
  size = .25 - size * .25;
  vec2 uv = smoothstep(size, size + size * vec2(.002), st * (1. - st));
  return uv.x * uv.y;
}

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb (in vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x * 6. + vec3(.0, 4., 2.), 6.) - 3.) - 1., .0, 1.);
  rgb = rgb * rgb * (3. - 2. * rgb);
  return c.z * mix(vec3(1.), rgb, c.y);
}

vec4 displayTheFightingTemeraire () {
  vec2 st = normalizeResolution();

  vec3 c1 = vec3(.37, .46, .69);
  vec3 c2 = vec3(.88, .79, .61);
  vec3 c3 = vec3(.88, .61, .42);
  vec3 c4 = vec3(.45, .13, .4);
  vec3 c5 = vec3(.20, .11, .9);
  vec3 c6 = vec3(.60, .54, .55);

  vec3 pct = vec3(st.x);

  pct.r = smoothstep(0.0, 1.0, st.x);
  pct.g = sin(st.x * PI);
  pct.b = pow(st.x, 0.5);

  vec3 color = mix(c1, c2, pct * .5);
       color = mix(color, c3, pct * 2.);
       color = mix(color, c4, pct * .5);
       color = mix(color, c5, pct * .25);
       color = mix(color, c6, pct * 0.5);

  return vec4(color, 1.0);
}

vec4 displaySunset () {
  vec3 c1 = vec3(.98, .79, .15);
  vec3 c2 = vec3(.33, .34, .54);

  vec2 st = normalizeResolution();


  vec3 pct = smoothstep(.0, abs(sin(u_time * 0.2)), pow(abs(st.y), 1.5));
  vec3 color = mix(c1, c2, pct);

  return vec4(color, 1.0);
}

vec4 displayRainbow () {
  vec3 red = vec3(.87, .0, .0);
  vec3 orange = vec3(.96, .38, .18);
  vec3 yellow = vec3(.99, .96, .0);
  vec3 green = vec3(.23, .74, .0);
  vec3 blue = vec3(.22, .62, 1.);
  vec3 indigo = vec3(.3, .0, .52);
  vec3 violet = vec3(.17, .0, .62);

  vec2 st = normalizeResolution();

  vec3 color = mix(red,   orange, smoothstep(.0, .2, st.x));
       color = mix(color, yellow, smoothstep(.1, .4, st.x));
       color = mix(color, green,  smoothstep(.3, .5, st.x));
       color = mix(color, blue,   smoothstep(.4, .7, st.x));
       color = mix(color, indigo, smoothstep(.6, .9, st.x));
       color = mix(color, violet, smoothstep(.8, 1., st.x));

  return vec4(color, 1.);
}

vec4 displayFlag () {
  vec3 blue = vec3(.22, .62, 1.);
  vec3 yellow = vec3(.99, .96, .0);

  vec2 st = normalizeResolution();

  return vec4(mix(yellow, blue, step(.5, st.y)), 1.);
}

vec4 displayPolarSpectrum () {
  vec2 st = normalizeResolution();
  vec3 color = vec3(.0);

  vec2 toCenter = vec2(.5) - st;
  float angle   = atan(toCenter.y, toCenter.x);
  float radius  = length(toCenter) * 3.;

  color = hsb2rgb(vec3((angle/TWO_PI) + u_time * .2, radius, 1.));
  return vec4(color, 1.);
}

vec4 displayIoc1 () {
  vec2 st = normalizeResolution();
  vec3 influenced_color = vec3(0.745,0.678,0.539);
  vec3 influencing_color_A = vec3(0.653,0.918,0.985);
  vec3 influencing_color_B = vec3(0.980,0.576,0.113);

  vec3 color = mix(influencing_color_A, influencing_color_B, step(.5, st.x));

  color = mix(color, influenced_color, rect(abs((st - vec2(.5, .0)) * vec2(2., 1.)), vec2(.15, .15)));
  return vec4(color, 1.);
}


vec4 displayIoc2 () {
  vec2 st = normalizeResolution();
  vec3 influenced_color = vec3(0.577,0.441,0.700);

  vec3 influencing_color_A = vec3(0.319,0.167,0.365);
  vec3 influencing_color_B = vec3(0.628,0.526,0.775);
  vec3 color = mix(influencing_color_A, influencing_color_B, step(.5, st.x));

  color = mix(color, influenced_color, rect(abs((st - vec2(.5, .0)) * vec2(2., 1.)), vec2(.15, .15)));
  return vec4(color, 1.);
}


vec4 displayIoc3 () {
  vec2 st = normalizeResolution();
  vec3 influenced_color = vec3(0.548,0.565,0.542);
  vec3 influencing_color_A = vec3(0.295,0.295,0.295);
  vec3 influencing_color_B = vec3(0.904,0.947,0.965);

  vec3 color = mix(influencing_color_A, influencing_color_B, st.y);

  color = mix(color, influenced_color, rect(st, vec2(.05, .40)));
  return vec4(color, 1.);
}

void main () {
  gl_FragColor = displayIoc3();
}
