/**
 * WebGL Fragment Shader Hero Controller
 * FlyRank AI Capstone — Week 1 Assignment
 * 
 * Features:
 * - Responsible devicePixelRatio cap: Math.min(window.devicePixelRatio || 1, 2)
 * - Tab visibility listener: pauses rendering when document.hidden is true
 * - IntersectionObserver: pauses rendering when canvas is scrolled offscreen
 * - Reduced motion support: window.matchMedia('(prefers-reduced-motion: reduce)') single-pass fallback
 * - Mouse vector easing with linear interpolation (lerp)
 */

export const VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const FRAGMENT_SHADER_SOURCE = `
#ifdef GL_ES
precision highp float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_grain_intensity;

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

vec3 palette(float t) {
    vec3 a = vec3(0.04, 0.06, 0.10);
    vec3 b = vec3(0.12, 0.45, 0.42);
    vec3 c = vec3(1.0,  1.0,  0.8);
    vec3 d = vec3(0.48, 0.72, 0.88);
    return a + b * cos(6.28318 * (c * t + d));
}

void main() {
    vec2 st = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);

    vec2 mouseUV = u_mouse;
    float distToMouse = length(st - mouseUV);
    float mouseForce = exp(-distToMouse * 3.5);
    vec2 mouseDisplacement = normalize(st - mouseUV + 0.0001) * mouseForce * 0.25;

    float n = flowField(st, u_time, mouseDisplacement);
    float val = n * 0.5 + 0.5;

    vec3 color = palette(val);

    vec3 mouseGlowColor = vec3(0.08, 0.72, 0.65);
    color += mouseGlowColor * mouseForce * 0.45;

    float vignette = length(st);
    float vMask = smoothstep(0.4, 1.4, vignette);
    color = mix(color, vec3(0.035, 0.05, 0.085), vMask * 0.75);

    float grain = (hash21(gl_FragCoord.xy + u_time * 10.0) - 0.5) * u_grain_intensity;
    color += vec3(grain);

    gl_FragColor = vec4(max(color, vec3(0.0)), 1.0);
}
`;

export class ShaderHero {
    constructor(canvasElement, options = {}) {
        this.canvas = canvasElement;
        this.options = {
            grainIntensity: 0.05,
            forceReducedMotion: false,
            onStatsUpdate: null,
            ...options
        };

        this.gl = this.canvas.getContext('webgl', { powerPreference: 'low-power', alpha: false }) ||
                  this.canvas.getContext('experimental-webgl');

        if (!this.gl) {
            console.warn('WebGL not supported, falling back to static gradient CSS.');
            this.canvas.style.background = 'radial-gradient(ellipse at center, #14b8a6 0%, #090d16 80%)';
            return;
        }

        this.program = null;
        this.uniforms = {};
        this.animationFrameId = null;
        this.startTime = performance.now();
        this.lastTime = 0;
        this.frameCount = 0;
        this.fps = 60;
        this.lastFpsCheck = performance.now();

        // Mouse coordinates: target vs lerped actual
        this.mouseTarget = { x: 0, y: 0 };
        this.mouseCurrent = { x: 0, y: 0 };

        this.isTabVisible = true;
        this.isElementVisible = true;
        this.isReducedMotion = false;

        this.init();
    }

    init() {
        this.checkReducedMotionPreference();
        this.createProgram();
        this.setupBuffers();
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.resize();
        this.renderSingleFrame(); // Initial static frame render

        if (!this.shouldPauseAnimation()) {
            this.startLoop();
        }
    }

    checkReducedMotionPreference() {
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.isReducedMotion = motionQuery.matches || this.options.forceReducedMotion;
        motionQuery.addEventListener?.('change', (e) => {
            this.isReducedMotion = e.matches || this.options.forceReducedMotion;
            if (this.isReducedMotion) {
                this.stopLoop();
                this.renderSingleFrame();
            } else if (!this.shouldPauseAnimation()) {
                this.startLoop();
            }
        });
    }

    setForceReducedMotion(enabled) {
        this.options.forceReducedMotion = enabled;
        this.isReducedMotion = enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (this.isReducedMotion) {
            this.stopLoop();
            this.renderSingleFrame();
        } else if (!this.shouldPauseAnimation()) {
            this.startLoop();
        }
    }

    setGrainIntensity(value) {
        this.options.grainIntensity = value;
        if (this.isReducedMotion || this.shouldPauseAnimation()) {
            this.renderSingleFrame();
        }
    }

    compileShader(source, type) {
        const shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    createProgram() {
        const vert = this.compileShader(VERTEX_SHADER_SOURCE, this.gl.VERTEX_SHADER);
        const frag = this.compileShader(FRAGMENT_SHADER_SOURCE, this.gl.FRAGMENT_SHADER);
        
        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, vert);
        this.gl.attachShader(this.program, frag);
        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error('Program link error:', this.gl.getProgramInfoLog(this.program));
            return;
        }

        this.gl.useProgram(this.program);

        // Get uniform locations
        this.uniforms = {
            u_resolution: this.gl.getUniformLocation(this.program, 'u_resolution'),
            u_time: this.gl.getUniformLocation(this.program, 'u_time'),
            u_mouse: this.gl.getUniformLocation(this.program, 'u_mouse'),
            u_grain_intensity: this.gl.getUniformLocation(this.program, 'u_grain_intensity')
        };
    }

    setupBuffers() {
        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        // Fullscreen quad in clip space (-1 to +1)
        const positions = new Float32Array([
            -1.0, -1.0,
             1.0, -1.0,
            -1.0,  1.0,
            -1.0,  1.0,
             1.0, -1.0,
             1.0,  1.0,
        ]);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);

        const aPositionLocation = this.gl.getAttribLocation(this.program, 'a_position');
        this.gl.enableVertexAttribArray(aPositionLocation);
        this.gl.vertexAttribPointer(aPositionLocation, 2, this.gl.FLOAT, false, 0, 0);
    }

    resize() {
        if (!this.canvas || !this.gl) return;
        const rect = this.canvas.getBoundingClientRect();
        const width = rect.width || window.innerWidth;
        const height = rect.height || window.innerHeight;

        // RESPONSIBLE DPR CAP: Cap devicePixelRatio at 2.0 max to prevent rendering 4K canvas frames on retina displays
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        
        const displayWidth = Math.floor(width * dpr);
        const displayHeight = Math.floor(height * dpr);

        if (this.canvas.width !== displayWidth || this.canvas.height !== displayHeight) {
            this.canvas.width = displayWidth;
            this.canvas.height = displayHeight;
            this.gl.viewport(0, 0, displayWidth, displayHeight);
        }
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            if (this.isReducedMotion || this.shouldPauseAnimation()) {
                this.renderSingleFrame();
            }
        });

        // Track pointer movement relative to canvas
        const handlePointerMove = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const px = e.clientX - rect.left;
            const py = e.clientY - rect.top;

            // Map mouse to [-1.0, 1.0] centered UV coordinate space
            const minDim = Math.min(rect.width, rect.height);
            this.mouseTarget.x = ((px - rect.width * 0.5) / minDim) * 2.0;
            // Invert Y coordinate for WebGL coordinate space
            this.mouseTarget.y = -((py - rect.height * 0.5) / minDim) * 2.0;
        };

        window.addEventListener('pointermove', handlePointerMove, { passive: true });

        // Tab visibility listener
        document.addEventListener('visibilitychange', () => {
            this.isTabVisible = !document.hidden;
            if (this.isTabVisible && !this.shouldPauseAnimation()) {
                this.startLoop();
            } else {
                this.stopLoop();
            }
        });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.isElementVisible = entry.isIntersecting;
                if (this.isElementVisible && !this.shouldPauseAnimation()) {
                    this.startLoop();
                } else {
                    this.stopLoop();
                }
            });
        }, { threshold: 0.05 });

        observer.observe(this.canvas);
    }

    shouldPauseAnimation() {
        return !this.isTabVisible || !this.isElementVisible || this.isReducedMotion;
    }

    startLoop() {
        if (this.animationFrameId !== null) return;
        const tick = (now) => {
            this.renderFrame(now);
            if (!this.shouldPauseAnimation()) {
                this.animationFrameId = requestAnimationFrame(tick);
            } else {
                this.animationFrameId = null;
            }
        };
        this.animationFrameId = requestAnimationFrame(tick);
    }

    stopLoop() {
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    renderSingleFrame() {
        this.renderFrame(performance.now());
    }

    renderFrame(now) {
        if (!this.gl || !this.program) return;

        // FPS Calculation
        this.frameCount++;
        if (now - this.lastFpsCheck >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsCheck));
            this.frameCount = 0;
            this.lastFpsCheck = now;
        }

        // Smooth Lerp Mouse Movement (easing factor 0.08)
        this.mouseCurrent.x += (this.mouseTarget.x - this.mouseCurrent.x) * 0.08;
        this.mouseCurrent.y += (this.mouseTarget.y - this.mouseCurrent.y) * 0.08;

        const elapsedTime = (now - this.startTime) / 1000.0;
        // In reduced motion mode, freeze time at 1.5 seconds for a clean static aesthetic composition
        const shaderTime = this.isReducedMotion ? 1.5 : elapsedTime;

        this.gl.useProgram(this.program);

        // Uniform bindings
        this.gl.uniform2f(this.uniforms.u_resolution, this.canvas.width, this.canvas.height);
        this.gl.uniform1f(this.uniforms.u_time, shaderTime);
        this.gl.uniform2f(this.uniforms.u_mouse, this.mouseCurrent.x, this.mouseCurrent.y);
        this.gl.uniform1f(this.uniforms.u_grain_intensity, this.options.grainIntensity);

        // Draw call
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

        // Notify HUD stats observer if registered
        if (typeof this.options.onStatsUpdate === 'function') {
            this.options.onStatsUpdate({
                time: shaderTime.toFixed(2),
                mouseX: this.mouseCurrent.x.toFixed(2),
                mouseY: this.mouseCurrent.y.toFixed(2),
                width: this.canvas.width,
                height: this.canvas.height,
                dpr: Math.min(window.devicePixelRatio || 1, 2),
                fps: this.isReducedMotion ? 0 : this.fps,
                isPaused: this.shouldPauseAnimation(),
                isReducedMotion: this.isReducedMotion
            });
        }
    }

    destroy() {
        this.stopLoop();
        if (this.gl && this.program) {
            this.gl.deleteProgram(this.program);
        }
    }
}
