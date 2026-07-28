import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { useEffect, useRef } from "react";
import "./Galaxy.css";

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

function buildFragmentShader(numLayer) {
  return `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform bool uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform bool uTransparent;

varying vec2 vUv;

#define NUM_LAYER ${numLayer.toFixed(1)}
#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tri(float x) {
  return abs(fract(x) * 2.0 - 1.0);
}

float tris(float x) {
  float t = fract(x);
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
}

float trisn(float x) {
  float t = fract(x);
  return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float Star(vec2 uv, float flare) {
  float d = length(uv);
  float m = (0.05 * uGlowIntensity) / d;
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * flare * uGlowIntensity;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * 0.3 * flare * uGlowIntensity;
  m *= smoothstep(1.0, 0.2, d);
  return m;
}

vec3 StarLayer(vec2 uv) {
  vec3 col = vec3(0.0);

  vec2 gv = fract(uv) - 0.5; 
  vec2 id = floor(uv);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + vec2(float(x), float(y));
      float seed = Hash21(si);
      float size = fract(seed * 345.32);
      float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
      float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;

      float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
      float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
      float grn = min(red, blu) * seed;
      vec3 base = vec3(red, grn, blu);
      
      float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
      hue = fract(hue + uHueShift / 360.0);
      float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
      float val = max(max(base.r, base.g), base.b);
      base = hsv2rgb(vec3(hue, sat, val));

      vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;

      float star = Star(gv - offset - pad, flareSize);
      vec3 color = base;

      float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
      twinkle = mix(1.0, twinkle, uTwinkleIntensity);
      star *= twinkle;
      
      col += star * size * color;
    }
  }

  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;

  vec2 mouseNorm = uMouse - vec2(0.5);
  
  if (uAutoCenterRepulsion > 0.0) {
    vec2 centerUV = vec2(0.0, 0.0);
    float centerDist = length(uv - centerUV);
    vec2 repulsion = normalize(uv - centerUV) * (uAutoCenterRepulsion / (centerDist + 0.1));
    uv += repulsion * 0.05;
  } else if (uMouseRepulsion) {
    vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
    float mouseDist = length(uv - mousePosUV);
    vec2 repulsion = normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1));
    uv += repulsion * 0.05 * uMouseActiveFactor;
  } else {
    vec2 mouseOffset = mouseNorm * 0.1 * uMouseActiveFactor;
    uv += mouseOffset;
  }

  float autoRotAngle = uTime * uRotationSpeed;
  mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
  uv = autoRot * uv;

  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;

  vec3 col = vec3(0.0);

  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
    float depth = fract(i + uStarSpeed * uSpeed);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    col += StarLayer(uv * scale + i * 453.32) * fade;
  }

  if (uTransparent) {
    float alpha = length(col);
    alpha = smoothstep(0.0, 0.3, alpha);
    alpha = min(alpha, 1.0);
    gl_FragColor = vec4(col, alpha);
  } else {
    gl_FragColor = vec4(col, 1.0);
  }
}
`;
}

// Full quality is byte-identical to what shipped before perf tiering existed.
// Reduced trades half the star layers for headroom on weak/software GPUs;
// REDUCED_FRAGMENT is only ever compiled into a Program if a device actually
// downgrades, so capable devices never pay a second shader compile.
const FULL_FRAGMENT = buildFragmentShader(4.0);
const REDUCED_FRAGMENT = buildFragmentShader(2.0);

// Perf-tier tuning. Thresholds are our best estimate, not calibrated against
// real low-power hardware (unavailable in the environment this was written
// in) — revisit after testing on an actual weak device.
const WARMUP_FRAMES = 5;
const SAMPLE_FRAMES = 40;
const GOOD_FRAME_MS = 40; // ~25fps floor
const REDUCED_SCALE = 0.75;
const REDUCED_FRAME_INTERVAL_MS = 1000 / 30;
const SOFTWARE_RENDERER_PATTERN =
  /swiftshader|llvmpipe|software|swangle|d3d11 warp/;

export default function Galaxy({
  focal = [0.5, 0.5],
  rotation = [1.0, 0.0],
  starSpeed = 0.5,
  density = 1,
  hueShift = 140,
  disableAnimation = false,
  speed = 1.0,
  mouseInteraction = true,
  glowIntensity = 0.3,
  saturation = 0.0,
  mouseRepulsion = true,
  repulsionStrength = 2,
  twinkleIntensity = 0.3,
  rotationSpeed = 0.1,
  autoCenterRepulsion = 0,
  transparent = true,
  ...rest
}) {
  const ctnDom = useRef(null);
  const targetMousePos = useRef({ x: 0.5, y: 0.5 });
  const smoothMousePos = useRef({ x: 0.5, y: 0.5 });
  const targetMouseActive = useRef(0.0);
  const smoothMouseActive = useRef(0.0);

  useEffect(() => {
    if (!ctnDom.current) return;
    const ctn = ctnDom.current;
    const renderer = new Renderer({
      alpha: transparent,
      premultipliedAlpha: false,
    });
    const gl = renderer.gl;

    if (transparent) {
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);
    } else {
      gl.clearColor(0, 0, 0, 1);
    }

    // Perf tier: a direct GPU-capability query (the renderer string WebGL
    // itself reports), not OS/user-agent sniffing. Software rasterizers
    // (SwiftShader, llvmpipe, ANGLE's software fallback, D3D11 WARP) start
    // degraded immediately instead of burning a full-quality frame first.
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const rendererString = debugInfo
      ? String(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)).toLowerCase()
      : "";
    let tier = SOFTWARE_RENDERER_PATTERN.test(rendererString)
      ? "reduced"
      : "full";
    let tierSettled = false;
    let staticBailout = false;

    let program;
    let reducedProgram = null;

    function resize() {
      // Scale the internal drawing buffer only (via dpr), not the
      // width/height passed to setSize — setSize also drives the canvas's
      // on-screen CSS size, so scaling those would visibly shrink the
      // canvas inside its container instead of just lowering its
      // resolution. The browser upscales the smaller buffer to fill the
      // same box, which is the actual "resolution scale" perf lever.
      renderer.dpr = tier === "reduced" ? REDUCED_SCALE : 1;
      renderer.setSize(ctn.offsetWidth, ctn.offsetHeight);
      if (program) {
        program.uniforms.uResolution.value = new Color(
          gl.canvas.width,
          gl.canvas.height,
          gl.canvas.width / gl.canvas.height,
        );
      }
    }
    window.addEventListener("resize", resize, false);
    resize();

    const geometry = new Triangle(gl);
    // Shared by every program variant, so swapping `mesh.program` on a tier
    // downgrade carries over live uTime/uMouse/etc. with no visual pop.
    const uniforms = {
      uTime: { value: 0 },
      uResolution: {
        value: new Color(
          gl.canvas.width,
          gl.canvas.height,
          gl.canvas.width / gl.canvas.height,
        ),
      },
      uFocal: { value: new Float32Array(focal) },
      uRotation: { value: new Float32Array(rotation) },
      uStarSpeed: { value: starSpeed },
      uDensity: { value: density },
      uHueShift: { value: hueShift },
      uSpeed: { value: speed },
      uMouse: {
        value: new Float32Array([
          smoothMousePos.current.x,
          smoothMousePos.current.y,
        ]),
      },
      uGlowIntensity: { value: glowIntensity },
      uSaturation: { value: saturation },
      uMouseRepulsion: { value: mouseRepulsion },
      uTwinkleIntensity: { value: twinkleIntensity },
      uRotationSpeed: { value: rotationSpeed },
      uRepulsionStrength: { value: repulsionStrength },
      uMouseActiveFactor: { value: 0.0 },
      uAutoCenterRepulsion: { value: autoCenterRepulsion },
      uTransparent: { value: transparent },
    };

    program = new Program(gl, {
      vertex: vertexShader,
      fragment: tier === "reduced" ? REDUCED_FRAGMENT : FULL_FRAGMENT,
      uniforms,
    });
    if (tier === "reduced") reducedProgram = program;

    const mesh = new Mesh(gl, { geometry, program });
    let animateId = null;

    // This shader is full-screen and costs real GPU on every frame, so it only
    // runs while the canvas is actually on screen and the tab is foregrounded.
    // `pausedFor` accumulates time spent stopped and is subtracted from the
    // clock, so resuming continues the animation instead of jumping ahead.
    let onScreen = true;
    let pageVisible = !document.hidden;
    let pausedFor = 0;
    let pausedAt = 0;

    // Startup perf check: samples real rAF-tick deltas (never the tier's own
    // frame-skip cap, which only engages once settled) so the measurement
    // reflects true device capability. Runs once; may cascade full->reduced
    // ->static within this single startup pass, then never re-arms — the
    // tier is fixed for the rest of the session, no periodic re-checks.
    let warmupLeft = WARMUP_FRAMES;
    let sampleCount = 0;
    let sampleSum = 0;
    let lastSampleT = null;
    let lastRenderTime = 0;

    function finishSampling(good) {
      if (good) {
        tierSettled = true;
        return;
      }
      if (tier === "full") {
        tier = "reduced";
        if (!reducedProgram) {
          reducedProgram = new Program(gl, {
            vertex: vertexShader,
            fragment: REDUCED_FRAGMENT,
            uniforms,
          });
        }
        program = reducedProgram;
        mesh.program = program;
        resize(); // re-applies REDUCED_SCALE now that tier changed
        warmupLeft = WARMUP_FRAMES;
        sampleCount = 0;
        sampleSum = 0;
        lastSampleT = null;
      } else {
        // Already at the lowest animated tier and still can't hold a usable
        // framerate — stop rather than keep stuttering.
        staticBailout = true;
      }
    }

    function update(t) {
      if (staticBailout) {
        stop();
        return;
      }
      animateId = requestAnimationFrame(update);
      const time = t - pausedFor;
      program.uniforms.uTime.value = time * 0.001;
      program.uniforms.uStarSpeed.value = (time * 0.001 * starSpeed) / 10.0;

      const lerpFactor = 0.05;
      smoothMousePos.current.x +=
        (targetMousePos.current.x - smoothMousePos.current.x) * lerpFactor;
      smoothMousePos.current.y +=
        (targetMousePos.current.y - smoothMousePos.current.y) * lerpFactor;

      smoothMouseActive.current +=
        (targetMouseActive.current - smoothMouseActive.current) * lerpFactor;

      program.uniforms.uMouse.value[0] = smoothMousePos.current.x;
      program.uniforms.uMouse.value[1] = smoothMousePos.current.y;
      program.uniforms.uMouseActiveFactor.value = smoothMouseActive.current;

      const skipRender =
        tier === "reduced" &&
        tierSettled &&
        t - lastRenderTime < REDUCED_FRAME_INTERVAL_MS;
      if (!skipRender) {
        lastRenderTime = t;
        renderer.render({ scene: mesh });
      }

      if (!tierSettled && !staticBailout) {
        if (lastSampleT !== null) {
          const delta = t - lastSampleT;
          if (warmupLeft > 0) {
            warmupLeft -= 1;
          } else {
            sampleSum += delta;
            sampleCount += 1;
          }
        }
        lastSampleT = t;
        if (sampleCount >= SAMPLE_FRAMES) {
          finishSampling(sampleSum / sampleCount <= GOOD_FRAME_MS);
        }
      }
    }

    function start() {
      if (animateId !== null) return;
      if (pausedAt) {
        pausedFor += performance.now() - pausedAt;
        pausedAt = 0;
      }
      animateId = requestAnimationFrame(update);
    }

    function stop() {
      if (animateId === null) return;
      cancelAnimationFrame(animateId);
      animateId = null;
      pausedAt = performance.now();
    }

    function sync() {
      if (disableAnimation || staticBailout) {
        stop();
        return;
      }
      if (onScreen && pageVisible) start();
      else stop();
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { rootMargin: "200px" },
    );
    io.observe(ctn);

    function handleVisibility() {
      pageVisible = !document.hidden;
      sync();
    }
    document.addEventListener("visibilitychange", handleVisibility);

    // Reduce-motion: paint exactly one real frame, never schedule rAF at
    // all — the old behavior kept rendering every frame at full GPU cost
    // with just the uniforms frozen, which paid for animation nobody saw.
    if (disableAnimation) {
      renderer.render({ scene: mesh });
    } else {
      start();
    }
    ctn.appendChild(gl.canvas);

    function handleMouseMove(e) {
      const rect = ctn.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      targetMousePos.current = { x, y };
      targetMouseActive.current = 1.0;
    }

    function handleMouseLeave() {
      targetMouseActive.current = 0.0;
    }

    if (mouseInteraction) {
      ctn.addEventListener("mousemove", handleMouseMove);
      ctn.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", resize);
      if (mouseInteraction) {
        ctn.removeEventListener("mousemove", handleMouseMove);
        ctn.removeEventListener("mouseleave", handleMouseLeave);
      }
      ctn.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
    // Depend on primitives only: `focal`/`rotation` are array literals, so a
    // fresh identity on every parent render would otherwise tear down and
    // rebuild the entire WebGL context (renderer, shaders, program).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    focal[0],
    focal[1],
    rotation[0],
    rotation[1],
    starSpeed,
    density,
    hueShift,
    disableAnimation,
    speed,
    mouseInteraction,
    glowIntensity,
    saturation,
    mouseRepulsion,
    twinkleIntensity,
    rotationSpeed,
    repulsionStrength,
    autoCenterRepulsion,
    transparent,
  ]);

  return <div ref={ctnDom} className="galaxy-container" {...rest} />;
}
