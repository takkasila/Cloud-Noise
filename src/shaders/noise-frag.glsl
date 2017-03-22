// uniform sampler2D image;
uniform float hueStop;
uniform float rangeMultiplier;

varying float noiseVal;
varying vec3 norm;
varying float normHeight;

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  float hueRange = noiseVal * hueStop * rangeMultiplier;
  gl_FragColor = vec4(hsv2rgb(vec3(hueRange, noiseVal, 0.9)), 1.0);
}