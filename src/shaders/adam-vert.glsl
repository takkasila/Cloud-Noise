
// varying vec2 vUv;
varying vec3 norm;
void main() {
    // vUv = uv;
    norm = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}