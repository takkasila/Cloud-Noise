// uniform sampler2D image;
uniform float time;
varying float noiseVal;
varying vec3 norm;

void main() {

  // vec4 color = texture2D( image, uv );
  gl_FragColor = vec4( cos(time)*cos(noiseVal), 0.75*sin(noiseVal), (norm.z+1.0)/2.0, 1.0 );
  // gl_FragColor = vec4(vec3(cos(time)), 1.0);

}