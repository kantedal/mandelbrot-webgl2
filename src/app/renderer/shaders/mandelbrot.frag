#version 300 es
precision highp float;

in vec2 v_texCoord;
out vec4 outColor;

uniform float u_time;
uniform float u_zoom;
uniform vec2 u_resolution;

uniform float u_mouseDown;
uniform vec2 u_mousePosition;

vec2 mandelbrot(vec2 z, vec2 c) {
  return mat2(z,-z.y,z.x)*z + c;
}

void main() {
  vec2 mousePos = vec2(u_mousePosition.x, -u_mousePosition.y) / u_resolution - vec2(0.5, 0.5);

  // Mandelbrot: z = z^2 + c
  vec2 z = vec2(0.0);
  vec2 c = vec2(2.0 * (v_texCoord - vec2(0.5)));
  bool mandelbrotExploded = false;

  // Iterate mandelbrot
  for (int i = 0; i < 100; i++) {
    z = mandelbrot(z, c);

    // Squared distance is faster
    if (z.x*z.x + z.y*z.y > 4.0) {
       mandelbrotExploded = true;
       break;
    }
  }

  outColor = mandelbrotExploded ? vec4(0,0,0,1) : vec4(1); //iterate_pixel(1.0 / u_zoom * 2.0 * (v_texCoord - vec2(0.5) - mousePos ));
}
