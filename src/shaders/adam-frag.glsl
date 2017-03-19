// varying vec2 vUv;
// varying float noise;
// uniform sampler2D image;
varying vec3 norm;

void main() {

  // vec2 uv = vec2(1,1) - vUv;
  // vec4 color = texture2D( image, uv );

  gl_FragColor = vec4( norm.rgb, 1.0 );

}