'use client';

// Adapted from the React Bits ASCIIText component
// (itself ported from https://codepen.io/JuanFuentes/pen/eYEeoyE).
//
// VANTA adaptations — structure and technique are unchanged, but:
//   * pure white output; the fragment shader no longer samples R/G/B at
//     separate offsets (that chromatic split was the colour fringing) and the
//     hue-rotate filter + its document-level mousemove listener are gone
//   * no Google Fonts and no IBM Plex Mono. The glyphs that get asciified are
//     drawn in our own display face (Satoshi, resolved from the live computed
//     style so the next/font hashed family name is picked up). The ASCII grid
//     itself must be monospace — reset() builds a fixed character grid from
//     measureText('A').width — so it uses the system ui-monospace stack, which
//     downloads nothing
//   * waves off by default, mouse-driven rotation removed entirely
//   * the text texture is uploaded once instead of every frame
//   * with waves off and rotation gone the scene is static, so it renders a
//     single frame and stops. With waves on it runs a loop gated by
//     IntersectionObserver + visibilitychange, and reduced-motion always
//     collapses to the single static frame
//   * full teardown of texture, geometry, material, renderer and observers

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
uniform float uTime;
uniform float uEnableWaves;

void main() {
    vUv = uv;
    float time = uTime * 5.;
    float waveFactor = uEnableWaves;

    vec3 transformed = position;

    transformed.x += sin(time + position.y) * 0.5 * waveFactor;
    transformed.y += cos(time + position.z) * 0.15 * waveFactor;
    transformed.z += sin(time + position.x) * waveFactor;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`;

// Single sample, forced to white. The original split r/g/b across three
// offset lookups, which both tinted the edges and cost four texture fetches.
const fragmentShader = `
varying vec2 vUv;
uniform sampler2D uTexture;

void main() {
    float a = texture2D(uTexture, vUv).a;
    gl_FragColor = vec4(1.0, 1.0, 1.0, a);
}
`;

const MONO_STACK =
  'ui-monospace, "Cascadia Mono", "Segoe UI Mono", "Liberation Mono", Menlo, Monaco, Consolas, monospace';

class AsciiFilter {
  constructor(renderer, { fontSize, fontFamily, charset, invert } = {}) {
    this.renderer = renderer;

    this.domElement = document.createElement('div');
    this.domElement.style.position = 'absolute';
    this.domElement.style.top = '0';
    this.domElement.style.left = '0';
    this.domElement.style.width = '100%';
    this.domElement.style.height = '100%';

    this.pre = document.createElement('pre');
    this.domElement.appendChild(this.pre);

    // Sampling surface only — never shown.
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d', { willReadFrequently: true });
    this.canvas.style.display = 'none';
    this.domElement.appendChild(this.canvas);

    this.invert = invert ?? true;
    this.fontSize = fontSize ?? 12;
    this.fontFamily = fontFamily ?? MONO_STACK;
    this.charset =
      charset ?? ' .\'`^",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';

    this.context.imageSmoothingEnabled = false;
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.renderer.setSize(width, height);
    this.reset();
  }

  reset() {
    this.context.font = `${this.fontSize}px ${this.fontFamily}`;
    const charWidth = this.context.measureText('A').width;

    this.cols = Math.floor(this.width / (this.fontSize * (charWidth / this.fontSize)));
    this.rows = Math.floor(this.height / this.fontSize);

    this.canvas.width = this.cols;
    this.canvas.height = this.rows;

    this.pre.style.fontFamily = this.fontFamily;
    this.pre.style.fontSize = `${this.fontSize}px`;
    this.pre.style.margin = '0';
    this.pre.style.padding = '0';
    this.pre.style.lineHeight = '1em';
    this.pre.style.position = 'absolute';
    this.pre.style.left = '0';
    this.pre.style.top = '0';
    this.pre.style.zIndex = '9';
    this.pre.style.color = '#ffffff';
  }

  render(scene, camera) {
    this.renderer.render(scene, camera);

    const w = this.canvas.width;
    const h = this.canvas.height;
    this.context.clearRect(0, 0, w, h);
    if (this.context && w && h) {
      this.context.drawImage(this.renderer.domElement, 0, 0, w, h);
    }

    this.asciify(this.context, w, h);
  }

  asciify(ctx, w, h) {
    if (!w || !h) return;
    const imgData = ctx.getImageData(0, 0, w, h).data;
    let str = '';
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = x * 4 + y * 4 * w;
        const [r, g, b, a] = [imgData[i], imgData[i + 1], imgData[i + 2], imgData[i + 3]];

        if (a === 0) {
          str += ' ';
          continue;
        }

        const gray = (0.3 * r + 0.6 * g + 0.1 * b) / 255;
        let idx = Math.floor((1 - gray) * (this.charset.length - 1));
        if (this.invert) idx = this.charset.length - idx - 1;
        str += this.charset[idx];
      }
      str += '\n';
    }
    this.pre.textContent = str;
  }

  dispose() {
    this.pre.remove();
    this.canvas.remove();
  }
}

class CanvasTxt {
  constructor(txt, { fontSize = 200, fontFamily = 'sans-serif', color = '#ffffff' } = {}) {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.txt = txt;
    this.fontSize = fontSize;
    this.fontFamily = fontFamily;
    this.color = color;
    this.font = `600 ${this.fontSize}px ${this.fontFamily}`;
  }

  resize() {
    this.context.font = this.font;
    const metrics = this.context.measureText(this.txt);
    this.canvas.width = Math.max(1, Math.ceil(metrics.width) + 20);
    this.canvas.height = Math.max(1, Math.ceil(this.fontSize) + 20);
  }

  render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = this.color;
    this.context.font = this.font;
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.fillText(this.txt, this.canvas.width / 2, this.canvas.height / 2);
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  get texture() {
    return this.canvas;
  }
}

class CanvAscii {
  constructor(
    { text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves, textFontFamily },
    containerElem,
    width,
    height,
  ) {
    this.textString = text;
    this.asciiFontSize = asciiFontSize;
    this.textFontSize = textFontSize;
    this.textColor = textColor;
    this.textFontFamily = textFontFamily;
    this.planeBaseHeight = planeBaseHeight;
    this.container = containerElem;
    this.width = width;
    this.height = height;
    this.enableWaves = enableWaves;

    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000);
    this.camera.position.z = 30;
    this.scene = new THREE.Scene();

    this.animationFrameId = null;
    this.onScreen = true;
    this.pageVisible = typeof document !== 'undefined' ? !document.hidden : true;
    this.pausedFor = 0;
    this.pausedAt = 0;
  }

  async init() {
    // Our own face, not a Google font. If it fails to load we still render
    // with whatever the stack falls back to.
    try {
      await document.fonts.load(`600 ${this.textFontSize}px ${this.textFontFamily}`);
    } catch {
      /* fall back silently */
    }
    await document.fonts.ready;

    this.setMesh();
    this.setRenderer();
  }

  setMesh() {
    this.textCanvas = new CanvasTxt(this.textString, {
      fontSize: this.textFontSize,
      fontFamily: this.textFontFamily,
      color: this.textColor,
    });
    this.textCanvas.resize();
    this.textCanvas.render();

    this.texture = new THREE.CanvasTexture(this.textCanvas.texture);
    this.texture.minFilter = THREE.NearestFilter;
    // The string never changes, so this is uploaded once rather than per frame.
    this.texture.needsUpdate = true;

    const textAspect = this.textCanvas.width / this.textCanvas.height;
    const baseH = this.planeBaseHeight;

    this.geometry = new THREE.PlaneGeometry(baseH * textAspect, baseH, 36, 36);
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: this.texture },
        uEnableWaves: { value: this.enableWaves ? 1.0 : 0.0 },
      },
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  setRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    this.renderer.setPixelRatio(1);
    this.renderer.setClearColor(0x000000, 0);

    this.filter = new AsciiFilter(this.renderer, {
      fontFamily: MONO_STACK,
      fontSize: this.asciiFontSize,
      invert: true,
    });

    this.container.appendChild(this.filter.domElement);
    this.setSize(this.width, this.height);
  }

  setSize(w, h) {
    this.width = w;
    this.height = h;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.filter.setSize(w, h);
    if (!this.enableWaves) this.renderFrame();
  }

  renderFrame(time = 0) {
    if (this.enableWaves) {
      this.mesh.material.uniforms.uTime.value = Math.sin(time * 0.001);
    }
    this.filter.render(this.scene, this.camera);
  }

  /** Waves off => the scene is static, so draw once and never schedule a loop. */
  load() {
    if (!this.enableWaves) {
      this.renderFrame();
      return;
    }
    this.observeVisibility();
    this.start();
  }

  observeVisibility() {
    this.io = new IntersectionObserver(([entry]) => {
      this.onScreen = entry.isIntersecting;
      this.sync();
    });
    this.io.observe(this.container);

    this.handleVisibility = () => {
      this.pageVisible = !document.hidden;
      this.sync();
    };
    document.addEventListener('visibilitychange', this.handleVisibility);
  }

  sync() {
    if (this.onScreen && this.pageVisible) this.start();
    else this.stop();
  }

  start() {
    if (this.animationFrameId !== null) return;
    if (this.pausedAt) {
      this.pausedFor += performance.now() - this.pausedAt;
      this.pausedAt = 0;
    }
    const loop = (t) => {
      this.animationFrameId = requestAnimationFrame(loop);
      this.renderFrame(t - this.pausedFor);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  stop() {
    if (this.animationFrameId === null) return;
    cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;
    this.pausedAt = performance.now();
  }

  dispose() {
    this.stop();

    if (this.io) {
      this.io.disconnect();
      this.io = null;
    }
    if (this.handleVisibility) {
      document.removeEventListener('visibilitychange', this.handleVisibility);
      this.handleVisibility = null;
    }

    if (this.filter) {
      this.filter.dispose();
      if (this.filter.domElement.parentNode === this.container) {
        this.container.removeChild(this.filter.domElement);
      }
      this.filter = null;
    }

    if (this.texture) {
      this.texture.dispose();
      this.texture = null;
    }
    if (this.geometry) {
      this.geometry.dispose();
      this.geometry = null;
    }
    if (this.material) {
      this.material.dispose();
      this.material = null;
    }
    this.scene.clear();

    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
      this.renderer = null;
    }
  }
}

export default function ASCIIText({
  text = '404',
  asciiFontSize = 8,
  textFontSize = 200,
  textColor = '#ffffff',
  planeBaseHeight = 8,
  enableWaves = false,
}) {
  const containerRef = useRef(null);
  const asciiRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let ro = null;

    const setup = async () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;

      // Resolve the real (hashed) next/font family name off the live element,
      // so the asciified glyphs are drawn in Satoshi rather than a guess.
      const textFontFamily = getComputedStyle(container).fontFamily || 'sans-serif';

      // Reduced motion collapses to the same single static frame.
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const instance = new CanvAscii(
        {
          text,
          asciiFontSize,
          textFontSize,
          textColor,
          planeBaseHeight,
          enableWaves: enableWaves && !reduced,
          textFontFamily,
        },
        container,
        width,
        height,
      );
      await instance.init();
      if (cancelled) {
        instance.dispose();
        return;
      }

      asciiRef.current = instance;
      instance.load();

      ro = new ResizeObserver((entries) => {
        const rect = entries[0]?.contentRect;
        if (rect && rect.width > 0 && rect.height > 0 && asciiRef.current) {
          asciiRef.current.setSize(rect.width, rect.height);
        }
      });
      ro.observe(container);
    };

    setup();

    return () => {
      cancelled = true;
      if (ro) ro.disconnect();
      if (asciiRef.current) {
        asciiRef.current.dispose();
        asciiRef.current = null;
      }
    };
  }, [text, asciiFontSize, textFontSize, textColor, planeBaseHeight, enableWaves]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden font-display"
    />
  );
}
