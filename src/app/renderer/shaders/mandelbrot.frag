#version 300 es
precision highp float;

in vec2 v_texCoord;
out vec4 outColor;

uniform float u_time;
uniform float u_zoom;
uniform vec2 u_resolution;

uniform float u_mouseDown;
uniform vec2 u_mousePosition;
uniform vec2 u_centerPosition;

vec4 hsvToRgb(float hue, float saturation, float value) {
  vec4 C = vec4(1.0, 0.73, 0.3, 3.0);
  vec4 p = abs(fract(vec4(hue) + C) * 6.0 - C.wwww);
  return vec4(value * mix(C.xxx, clamp(p.xyz - C.xxx, 0.0, 1.0), saturation), 1.0);
}

vec2 mandelbrot(vec2 z, vec2 c) {
  return mat2(z,-z.y,z.x)*z + c;
}

void main() {
  vec2 windowSizeCompensation = vec2(1.0, u_resolution.y / u_resolution.x);
  vec2 originalPosition = vec2(2.0 * (v_texCoord)) - vec2(0.5, 0.5);
  vec2 centerPosition = vec2(-u_centerPosition.x, u_centerPosition.y) / u_resolution - vec2(0.5, 0.5);
  vec2 mousePosition = vec2(-u_mousePosition.x, u_mousePosition.y) / u_resolution - vec2(0.5, 0.5);
  vec2 finalPosition = windowSizeCompensation * (u_zoom * originalPosition + centerPosition + mousePosition);

  // Mandelbrot: z = z^2 + c
  vec2 z = vec2(0.0);
  vec2 c = finalPosition;

  bool mandelbrotExploded = false;
  float iterations = 0.0;

  // Iterate mandelbrot
  for (int i = 0; i < 200; i++) {
    z = mandelbrot(z, c);

    // Squared distance is faster
    if (z.x*z.x + z.y*z.y > 4.0) {
       mandelbrotExploded = true;
       iterations = float(i);
       break;
    }
  }

  float hue = iterations / 200.0;
  //hsvToRgb(hue + 0.0, 0.8, 3.0) *
  outColor = mandelbrotExploded ? vec4(vec3(0.3, 0.3, 0.6) * hue, 1)  : vec4(0,0,0, 1.0);
  //outColor = mandelbrotExploded ?  vec4(vec3(0.6, 0.3, 0.6), 1)  : vec4(0,0,0, 1.0);
}
