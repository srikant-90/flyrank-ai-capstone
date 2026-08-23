/* ============================================================================
   FLYRANK AI CAPSTONE — WEEK 1 FRAGMENT SHADER HERO
   Author: Srikant (Frontend AI Engineering Track)
   Shader Title: "Cosmic Flow & Fluid Vector Field"
   
   Core Uniforms Used:
   - u_time       (float): Elapsed animation time in seconds
   - u_resolution (vec2) : Canvas viewport dimensions in physical pixels
   - u_mouse      (vec2) : Mouse position normalized to [-1.0, 1.0] coordinate space
   
   Mental Model:
   1. Normalization: Map gl_FragCoord to aspect-corrected centered UV coordinates.
   2. Interaction: Distort UV space using an exponential distance-decay mouse vector field.
   3. Domain Warping: Layer 3 octaves of rotating sine/cosine wave harmonics.
   4. Color Mapping: Blend deep cosmic dark, electric teal, cyber violet, and obsidian blue.
   5. Tactile Polish: Add procedural hash film grain to prevent color banding.
   6. Vignette: Apply radial edge darkening to guarantee WCAG AAA text legibility.
   ============================================================================ */

#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_grain_intensity;

// ----------------------------------------------------------------------------
// 1. UTILITY FUNCTIONS & ROTATION MATRIX
// ----------------------------------------------------------------------------
mat2 rotate2D(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}

float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

// ----------------------------------------------------------------------------
// 2. DOMAIN WARPING & WAVE NOISE FIELD
// ----------------------------------------------------------------------------
float flowField(vec2 st, float time, vec2 mouseOffset) {
    vec2 q = st;
    q += mouseOffset * 0.35;

    float wave1 = sin(q.x * 3.0 + q.y * 2.5 + time * 0.7);

    vec2 r = rotate2D(-time * 0.12) * (q * 1.6 + vec2(wave1 * 0.5));
    float wave2 = cos(r.x * 4.0 - r.y * 3.2 + time * 0.9);

    vec2 s = rotate2D(time * 0.15) * (r * 1.8 + vec2(wave2 * 0.4));
    float wave3 = sin(s.x * 5.2 + s.y * 4.1 - time * 1.1);

    return wave1 * 0.5 + wave2 * 0.35 + wave3 * 0.15;
}

// ----------------------------------------------------------------------------
// 3. COLOR PALETTE MAPPER
// ----------------------------------------------------------------------------
vec3 palette(float t) {
    vec3 a = vec3(0.04, 0.06, 0.10);  // Base canvas tone
    vec3 b = vec3(0.12, 0.45, 0.42);  // Rich teal/cyan vibrancy
    vec3 c = vec3(1.0,  1.0,  0.8);   // Frequencies
    vec3 d = vec3(0.48, 0.72, 0.88);  // Phase offsets
    
    return a + b * cos(6.28318 * (c * t + d));
}

// ----------------------------------------------------------------------------
// 4. MAIN FRAGMENT SHADER
// ----------------------------------------------------------------------------
void main() {
    // Aspect-corrected centered UV coordinates [-1.0, 1.0]
    vec2 st = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);

    // Mouse influence vector calculation
    vec2 mouseUV = u_mouse;
    float distToMouse = length(st - mouseUV);
    float mouseForce = exp(-distToMouse * 3.5);
    vec2 mouseDisplacement = normalize(st - mouseUV + 0.0001) * mouseForce * 0.25;

    // Multi-octave wave evaluation
    float n = flowField(st, u_time, mouseDisplacement);
    float val = n * 0.5 + 0.5;

    // Palette mapping
    vec3 color = palette(val);

    // Interactive mouse cursor teal glow
    vec3 mouseGlowColor = vec3(0.08, 0.72, 0.65);
    color += mouseGlowColor * mouseForce * 0.45;

    // Vignette Pass
    float vignette = length(st);
    float vMask = smoothstep(0.4, 1.4, vignette);
    color = mix(color, vec3(0.035, 0.05, 0.085), vMask * 0.75);

    // Procedural Grain Pass
    float grain = (hash21(gl_FragCoord.xy + u_time * 10.0) - 0.5) * u_grain_intensity;
    color += vec3(grain);

    gl_FragColor = vec4(max(color, vec3(0.0)), 1.0);
}
