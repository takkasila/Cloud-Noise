
uniform float time;
uniform int octave;
uniform float persistence;
uniform float innerRadius;
uniform float outterRadius;

varying float noiseVal;
varying vec3 norm;

#define MAX_OCTAVE 30
#define PI 3.1415926535

// Value noise by Morgan McGuire @morgan3d, http://graphicscodex.com
float hash(float n) { return fract(sin(n) * 1e4); }
float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }

float noise3D(vec3 p) {
	const vec3 step = vec3(110, 241, 171);

	vec3 i = floor(p);
	vec3 f = fract(p);
 
	// For performance, compute the base input to a 1D hash from the integer part of the argument and the 
	// incremental change to the 1D based on the 3D -> 1D wrapping
  float n = dot(i, step);

	vec3 u = f * f * (3.0 - 2.0 * f);
	return mix(mix(mix( hash(n + dot(step, vec3(0, 0, 0))), hash(n + dot(step, vec3(1, 0, 0))), u.x),
                   mix( hash(n + dot(step, vec3(0, 1, 0))), hash(n + dot(step, vec3(1, 1, 0))), u.x), u.y),
               mix(mix( hash(n + dot(step, vec3(0, 0, 1))), hash(n + dot(step, vec3(1, 0, 1))), u.x),
                   mix( hash(n + dot(step, vec3(0, 1, 1))), hash(n + dot(step, vec3(1, 1, 1))), u.x), u.y), u.z);
}

float lerp(float a, float b, float t)
{
    return a * (1.0 - t) + b * t;
}

float cerp(float a, float b, float t)
{
    float cos_t = (1.0 - cos(t * PI)) * 0.5;
    return lerp(a, b, cos_t);
}

// 3D cosine interpolation
float interpolateNoise(vec3 p, float frequency)
{
    vec3 newP = p * frequency;
    vec3 p1, p2, p3, p4, p5, p6, p7, p8;
    vec3 diff = vec3(1.0) * frequency;
    // RHS, bottom to top
    p1 = newP + vec3(-diff.x, -diff.y, -diff.z);
    p2 = newP + vec3(+diff.x, -diff.y, -diff.z);
    p3 = newP + vec3(+diff.x, +diff.y, -diff.z);
    p4 = newP + vec3(-diff.x, +diff.y, -diff.z);
    p5 = newP + vec3(-diff.x, -diff.y, +diff.z);
    p6 = newP + vec3(+diff.x, -diff.y, +diff.z);
    p7 = newP + vec3(+diff.x, +diff.y, +diff.z);
    p8 = newP + vec3(-diff.x, +diff.y, +diff.z);

    return cerp(
        cerp(
            cerp(
                noise3D(p1)
                , noise3D(p2)
                , 0.5
            )
            , cerp(
                noise3D(p3)
                , noise3D(p4)
                , 0.5
            )
            , 0.5
        )
        , cerp(
            cerp(
                noise3D(p5)
                , noise3D(p6)
                , 0.5
            )
            , cerp(
                noise3D(p7)
                , noise3D(p8)
                , 0.5
            )
            , 0.5
        )
        , 0.5
    );
}

float fbm(vec3 p)
{
    float totalNoise = 0.0;
    float amplitude = 1.0;
    float frequency;
    for (int i = 0; i < MAX_OCTAVE; i++)
    {
        if(i < octave)
        {
            frequency = pow(2.0, float(i));
            totalNoise +=  amplitude * interpolateNoise(p, frequency);
            amplitude *= persistence;
        }
        else
            break;
    }
    return totalNoise;
}

void main() {
    norm = normal;
    noiseVal = fbm(position+vec3(time)) / float(octave);
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position * innerRadius + noiseVal * norm * outterRadius, 1.0 );
}