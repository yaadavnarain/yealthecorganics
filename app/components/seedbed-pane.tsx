"use client";

import { useEffect, useRef } from "react";
import { useSelectedLayoutSegments } from "next/navigation";
import styles from "./seedbed-pane.module.css";

// The homepage background: one fixed pane of seed rows behind every section.
//
// Fine pointer (desktop): the rows slide slowly with the scroll position, a
// fast scroll sends a wave of growth through them, and seeds near the cursor
// grow and turn mint.
// Touch build (coarse pointer or narrow screen): the same motion, made light.
// 1x pixels, about 0.45 MP, 30 frames a second, and a finger touch grows the
// seeds under it. Reduced motion: one still frame, never redrawn.
// No WebGL, a failed shader or a lost context: the CSS seed grid on the
// wrapper stays visible, so the page never shows a blank or black pane.

const VERT = "attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }";

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_res;
uniform float u_time;
uniform float u_scroll;
uniform float u_vel;
uniform vec2 u_mouse;
uniform float u_pres;
uniform float u_k;
uniform float u_boost;
const vec3 BG = vec3(0.114, 0.110, 0.122);
const vec3 GOLD = vec3(0.961, 0.784, 0.259);
const vec3 MINT = vec3(0.204, 0.827, 0.600);
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
void main(){
  float cell = 30.0 * u_k;
  float slide = u_scroll * 0.2;
  vec2 fp = gl_FragCoord.xy; fp.y -= slide;
  vec2 g = fp / cell; vec2 id = floor(g); vec2 f = fract(g) - 0.5;
  vec2 centre = (id + 0.5) * cell; centre.y += slide;
  float dm = length(centre - u_mouse) / (190.0 * u_k);
  float cur = u_pres * exp(-dm * dm);
  float n = noise(id * 0.16 + vec2(u_time * 0.02, -u_time * 0.015));
  // wide soft patches, so the rows fade in and out instead of filling the screen
  float field = smoothstep(0.30, 0.75, noise(id * 0.045 + vec2(7.3, 2.1 + u_time * 0.006)));
  float wave = 0.5 + 0.5 * sin(id.y * 0.5 + id.x * 0.12 - u_time * 0.5);
  float grow = clamp(0.08 + 0.22 * n * n + u_vel * 0.25 * wave + cur * 0.55, 0.0, 1.0);
  float r = mix(0.04, 0.13, grow);
  float aa = 1.0 / cell;
  float seed = 1.0 - smoothstep(r - aa, r + aa, length(f));
  vec3 tone = mix(GOLD, MINT, clamp(cur * 1.1 + u_vel * wave * 0.4, 0.0, 1.0));
  float alpha = min(1.0, mix(0.07, 0.30, grow) * mix(0.35, 1.0, max(field, cur)) * u_boost);
  vec3 col = mix(BG, tone, seed * alpha);
  gl_FragColor = vec4(col, 1.0);
}`;

const UNIFORMS = ["u_res", "u_time", "u_scroll", "u_vel", "u_mouse", "u_pres", "u_k", "u_boost"] as const;

export function SeedbedPane() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Form pages keep their own calm background, so the pane is not drawn there.
  // The Agribusiness and Membership pages stay plain charcoal by the owner's choice.
  const segments = useSelectedLayoutSegments();
  const quiet =
    segments[0] === "agribusiness" ||
    segments[0] === "membership" ||
    segments[0] === "website-feedback" ||
    (["membership", "agribusiness"].includes(segments[0]) && segments[1] === "reserve");

  useEffect(() => {
    if (quiet) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
    // Reduced motion: one still frame. Phones get a light live build (the
    // owner asked for motion there): 1x pixels, a small pixel budget and 30
    // frames a second, and the finger plays the cursor's part.
    const still = reduced;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.bindAttribLocation(program, 0, "a");
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const uniform = {} as Record<(typeof UNIFORMS)[number], WebGLUniformLocation | null>;
    for (const name of UNIFORMS) uniform[name] = gl.getUniformLocation(program, name);

    // The still build draws one frame, so it can afford a sharp buffer. The
    // live builds repaint, so they get a pixel budget instead.
    const maxDpr = still ? 2 : touch ? 1 : 1.5;
    const maxPixels = still ? 2_000_000 : touch ? 450_000 : 1_400_000;
    const minFrameMs = touch ? 1000 / 30 - 2 : 0;
    let lastDraw = -Infinity;
    let cssW = 1;
    let cssH = 1;
    let k = 1;
    const resize = () => {
      cssW = canvas.clientWidth || window.innerWidth;
      cssH = canvas.clientHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      const fit = Math.min(1, Math.sqrt(maxPixels / Math.max(1, cssW * dpr * cssH * dpr)));
      k = dpr * fit;
      const w = Math.max(1, Math.round(cssW * k));
      const h = Math.max(1, Math.round(cssH * k));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    let raf = 0;
    let last: number | null = null;
    let disposed = false;
    const start = performance.now();
    let scroll = window.scrollY;
    let lastY = window.scrollY;
    let vel = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let presence = 0;
    let targetPresence = 0;

    const request = () => {
      if (!disposed && raf === 0) raf = requestAnimationFrame(frame);
    };

    function frame(now: number) {
      raf = 0;
      if (disposed || !gl || gl.isContextLost()) return;
      const dt = last === null ? 0 : Math.min((now - last) / 1000, 0.1);
      last = now;

      if (!still) {
        const y = window.scrollY;
        const vh = window.innerHeight || 1;
        // viewport-heights per second, eased up fast and down slowly
        const speed = dt > 0 ? Math.abs(y - lastY) / vh / dt : 0;
        lastY = y;
        // Touch scrolls arrive in bursts, so the wave is damped there.
        const target = Math.min(1, speed * (touch ? 0.3 : 0.45));
        vel += (target - vel) * (target > vel ? 0.3 : 1 - Math.exp(-2.4 * dt));
        scroll += (y - scroll) * (dt === 0 ? 1 : 1 - Math.exp(-8 * dt));
        const follow = dt === 0 ? 1 : 1 - Math.exp(-10 * dt);
        mouseX += (targetX - mouseX) * follow;
        mouseY += (targetY - mouseY) * follow;
        presence += (targetPresence - presence) * follow;
      }

      // Phones: state keeps easing every frame, but the pane draws at 30 fps.
      if (!still && now - lastDraw < minFrameMs) {
        if (document.visibilityState !== "hidden") request();
        return;
      }
      lastDraw = now;

      resize();
      gl.uniform2f(uniform.u_res, canvas!.width, canvas!.height);
      gl.uniform1f(uniform.u_time, still ? 0 : (now - start) / 1000);
      gl.uniform1f(uniform.u_scroll, still ? 0 : scroll * k);
      gl.uniform1f(uniform.u_vel, still ? 0 : vel);
      gl.uniform2f(uniform.u_mouse, mouseX * k, (cssH - mouseY) * k);
      gl.uniform1f(uniform.u_pres, still ? 0 : presence);
      gl.uniform1f(uniform.u_k, k);
      // Small, bright phone screens wash the faint seeds out, so they get more weight.
      gl.uniform1f(uniform.u_boost, touch ? 1.7 : 1);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      canvas!.dataset.live = "true";

      if (!still && document.visibilityState !== "hidden") request();
      else last = null;
    }

    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (targetPresence === 0 && presence < 0.01) {
        mouseX = targetX;
        mouseY = targetY;
      }
      targetPresence = 1;
    };
    const onPointerLeave = () => {
      targetPresence = 0;
    };
    // A finger only counts while it is down; lifting it lets the seeds settle.
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse") return;
      targetX = mouseX = event.clientX;
      targetY = mouseY = event.clientY;
      targetPresence = 1;
    };
    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") targetPresence = 0;
    };
    const onVisibility = () => {
      if (document.visibilityState !== "hidden") request();
    };
    // A phone's address bar changes the viewport a few percent on every
    // scroll. The pane is sized in lvh so that never reaches it; a rotation
    // or a real window resize does, and gets one new frame.
    const onResize = () => {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      if (still && Math.abs(w - cssW) / cssW < 0.15 && Math.abs(h - cssH) / cssH < 0.15) return;
      request();
    };
    const onContextLost = (event: Event) => {
      event.preventDefault();
      delete canvas.dataset.live;
    };

    window.addEventListener("resize", onResize);
    canvas.addEventListener("webglcontextlost", onContextLost);
    if (!still) {
      if (touch) {
        window.addEventListener("pointerdown", onPointerDown, { passive: true });
        window.addEventListener("pointermove", onPointerMove, { passive: true });
        window.addEventListener("pointerup", onPointerUp, { passive: true });
        window.addEventListener("pointercancel", onPointerUp, { passive: true });
      } else {
        window.addEventListener("pointermove", onPointerMove, { passive: true });
        document.documentElement.addEventListener("pointerleave", onPointerLeave);
      }
      document.addEventListener("visibilitychange", onVisibility);
    }

    // First frame in this task: with alpha off an undrawn buffer is black.
    frame(performance.now());

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      delete canvas.dataset.live;
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [quiet]);

  if (quiet) return null;

  return (
    <div className={styles.pane} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
