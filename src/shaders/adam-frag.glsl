// uniform sampler2D image;
uniform float time;
varying float noiseVal;
varying vec3 norm;
varying float normHeight;

void main() {
  float normNoise = (noiseVal-1.0)*2.0;
  gl_FragColor = vec4( 1.0-normNoise/2.0, normNoise, sin(normNoise+time), 1.0 );
  // gl_FragColor = vec4( normNoise, normNoise, normNoise, 1.0);
}