
uniform vec3 topColor;
uniform vec3 btmColor;
uniform float skyboxRadius;

varying vec3 pos;

void main()
{
    gl_FragColor = vec4(mix(btmColor, topColor, (pos.y+skyboxRadius)/(2.0*skyboxRadius)), 1.0);
}