"use client";

import { useEffect, useRef } from "react";

export type AvatarShape = "orb" | "squircle" | "diamond" | "hex";
export type AvatarExpression = "focused" | "curious" | "happy" | "alert";

export interface AgentAvatarSpec {
  shape: AvatarShape;
  expression: AvatarExpression;
  color: string;
}

interface AgentOrbAvatarProps {
  spec: AgentAvatarSpec;
  size?: number;
  thinking?: boolean;
  className?: string;
}

function drawShapePath(
  ctx: CanvasRenderingContext2D,
  shape: AvatarShape,
  cx: number,
  cy: number,
  r: number
) {
  ctx.beginPath();
  if (shape === "orb") {
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
  } else if (shape === "squircle") {
    const k = r * 0.42;
    ctx.moveTo(cx - r + k, cy - r);
    ctx.lineTo(cx + r - k, cy - r);
    ctx.quadraticCurveTo(cx + r, cy - r, cx + r, cy - r + k);
    ctx.lineTo(cx + r, cy + r - k);
    ctx.quadraticCurveTo(cx + r, cy + r, cx + r - k, cy + r);
    ctx.lineTo(cx - r + k, cy + r);
    ctx.quadraticCurveTo(cx - r, cy + r, cx - r, cy + r - k);
    ctx.lineTo(cx - r, cy - r + k);
    ctx.quadraticCurveTo(cx - r, cy - r, cx - r + k, cy - r);
  } else if (shape === "diamond") {
    const cr = r * 0.24;
    const pts: [number, number][] = [
      [cx, cy - r * 1.04],
      [cx + r * 1.04, cy],
      [cx, cy + r * 1.04],
      [cx - r * 1.04, cy],
    ];
    for (let i = 0; i < 4; i++) {
      const prev = pts[(i + 3) % 4];
      const curr = pts[i];
      const next = pts[(i + 1) % 4];
      const dx1 = prev[0] - curr[0];
      const dy1 = prev[1] - curr[1];
      const dx2 = next[0] - curr[0];
      const dy2 = next[1] - curr[1];
      const len1 = Math.hypot(dx1, dy1);
      const len2 = Math.hypot(dx2, dy2);
      const sx = curr[0] + (dx1 / len1) * cr;
      const sy = curr[1] + (dy1 / len1) * cr;
      const ex = curr[0] + (dx2 / len2) * cr;
      const ey = curr[1] + (dy2 / len2) * cr;
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
      ctx.quadraticCurveTo(curr[0], curr[1], ex, ey);
    }
  } else {
    // Soft rounded hexagon
    const sides = 6;
    const pts: [number, number][] = [];
    for (let i = 0; i < sides; i++) {
      const a = (Math.PI / 3) * i - Math.PI / 2;
      pts.push([cx + Math.cos(a) * r * 1.02, cy + Math.sin(a) * r * 1.02]);
    }
    const cr = r * 0.22;
    for (let i = 0; i < sides; i++) {
      const prev = pts[(i + sides - 1) % sides];
      const curr = pts[i];
      const next = pts[(i + 1) % sides];
      const dx1 = prev[0] - curr[0];
      const dy1 = prev[1] - curr[1];
      const dx2 = next[0] - curr[0];
      const dy2 = next[1] - curr[1];
      const len1 = Math.hypot(dx1, dy1);
      const len2 = Math.hypot(dx2, dy2);
      const sx = curr[0] + (dx1 / len1) * cr;
      const sy = curr[1] + (dy1 / len1) * cr;
      const ex = curr[0] + (dx2 / len2) * cr;
      const ey = curr[1] + (dy2 / len2) * cr;
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
      ctx.quadraticCurveTo(curr[0], curr[1], ex, ey);
    }
  }
  ctx.closePath();
}

/**
 * Lightweight original HTML5 Canvas avatar with layered obsidian-glass lighting,
 * morphable silhouettes, independent eye wandering & blinking, and reduced-motion support.
 */
export function AgentOrbAvatar({
  spec,
  size = 36,
  thinking = false,
  className,
}: AgentOrbAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const seedRef = useRef<number>(Math.random() * 100);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rafId = 0;
    const seed = seedRef.current;

    const render = (now: number) => {
      const t = reducedMotion ? 0 : now * 0.001 + seed;
      ctx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2 + (thinking && !reducedMotion ? Math.sin(t * 5.2) * (size * 0.03) : 0);
      const r = size * 0.43;

      // Ambient subtle glow behind avatar
      const glow = ctx.createRadialGradient(cx, cy, r * 0.25, cx, cy, r * 1.15);
      glow.addColorStop(0, `${spec.color}40`);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.15, 0, Math.PI * 2);
      ctx.fill();

      // Main silhouette body
      ctx.save();
      drawShapePath(ctx, spec.shape, cx, cy, r);
      const bodyGrad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
      bodyGrad.addColorStop(0, spec.color);
      bodyGrad.addColorStop(0.62, `${spec.color}cc`);
      bodyGrad.addColorStop(1, "#121318");
      ctx.fillStyle = bodyGrad;
      ctx.fill();

      // Clipped folded glass highlight inside body
      ctx.clip();
      const foldGrad = ctx.createRadialGradient(
        cx - r * 0.34,
        cy - r * 0.48,
        r * 0.08,
        cx - r * 0.1,
        cy - r * 0.2,
        r * 1.18
      );
      foldGrad.addColorStop(0, "rgba(255, 255, 255, 0.48)");
      foldGrad.addColorStop(0.45, "rgba(255, 255, 255, 0.12)");
      foldGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = foldGrad;
      ctx.fillRect(0, 0, size, size);

      // Subtle dark inner depth at bottom
      const shadeGrad = ctx.createLinearGradient(cx, cy, cx, cy + r);
      shadeGrad.addColorStop(0, "rgba(8, 9, 10, 0)");
      shadeGrad.addColorStop(1, "rgba(8, 9, 10, 0.46)");
      ctx.fillStyle = shadeGrad;
      ctx.fillRect(0, 0, size, size);

      // Wandering eye offset
      const lookX = reducedMotion
        ? 0
        : thinking
          ? Math.cos(t * 3.4) * (r * 0.14)
          : Math.sin(t * 0.95) * (r * 0.11);
      const lookY = reducedMotion
        ? 0
        : thinking
          ? Math.sin(t * 3.4) * (r * 0.08) - r * 0.06
          : Math.cos(t * 0.63) * (r * 0.07);

      // Natural periodic blink (~every 4.2s)
      const blinkPhase = reducedMotion ? 1 : (t * 0.24) % 1;
      const isBlinking = blinkPhase > 0.955;
      const blinkScale = isBlinking ? 0.14 : 1;

      const eyeSep = r * 0.31;
      const eyeY = cy + r * 0.03 + lookY;
      const baseEyeRx = Math.max(1.4, r * 0.115);
      const baseEyeRy = Math.max(1.4, r * (spec.expression === "alert" ? 0.16 : 0.145));

      ctx.fillStyle = "#08090a";
      [-1, 1].forEach((dir) => {
        const ex = cx + dir * eyeSep + lookX;
        const rx = baseEyeRx;
        const ry = Math.max(0.8, baseEyeRy * blinkScale);

        if (spec.expression === "happy" && !isBlinking) {
          ctx.beginPath();
          ctx.strokeStyle = "#08090a";
          ctx.lineWidth = Math.max(1.4, r * 0.1);
          ctx.lineCap = "round";
          ctx.arc(ex, eyeY + ry * 0.25, rx * 1.15, Math.PI * 1.12, Math.PI * 1.88);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.ellipse(ex, eyeY, rx, ry, 0, 0, Math.PI * 2);
          ctx.fill();

          // Tiny crisp eye catchlight
          if (!isBlinking && size >= 28) {
            ctx.fillStyle = "rgba(255,255,255,0.85)";
            ctx.beginPath();
            ctx.arc(ex - rx * 0.25, eyeY - ry * 0.25, Math.max(0.7, rx * 0.32), 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#08090a";
          }
        }
      });

      // Subtle expression brow / mouth cue
      if (size >= 30) {
        ctx.strokeStyle = "rgba(8, 9, 10, 0.72)";
        ctx.lineWidth = Math.max(1.1, r * 0.075);
        ctx.lineCap = "round";
        if (spec.expression === "curious") {
          ctx.beginPath();
          ctx.arc(cx + lookX * 0.7, cy + r * 0.32 + lookY * 0.5, r * 0.1, 0, Math.PI * 2);
          ctx.stroke();
        } else if (spec.expression === "happy") {
          ctx.beginPath();
          ctx.arc(cx + lookX * 0.7, cy + r * 0.2 + lookY * 0.5, r * 0.18, 0.18 * Math.PI, 0.82 * Math.PI);
          ctx.stroke();
        } else if (spec.expression === "focused") {
          ctx.beginPath();
          ctx.moveTo(cx - r * 0.12 + lookX * 0.6, cy + r * 0.31 + lookY * 0.4);
          ctx.lineTo(cx + r * 0.12 + lookX * 0.6, cy + r * 0.31 + lookY * 0.4);
          ctx.stroke();
        }
      }
      ctx.restore();

      // Crisp specular rim border
      drawShapePath(ctx, spec.shape, cx, cy, r);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.24)";
      ctx.lineWidth = 1;
      ctx.stroke();

      if (!reducedMotion) {
        rafId = window.requestAnimationFrame(render);
      }
    };

    rafId = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(rafId);
  }, [spec.shape, spec.expression, spec.color, size, thinking]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      aria-hidden="true"
      className={className}
    />
  );
}
