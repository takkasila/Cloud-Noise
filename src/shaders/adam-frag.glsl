// uniform sampler2D image;
uniform float time;
varying float noiseVal;
varying vec3 norm;

void main() {
  gl_FragColor = vec4( cos(noiseVal+time), sin(noiseVal), (norm.z+1.0)/2.0 * cos(noiseVal), 1.0 );
}