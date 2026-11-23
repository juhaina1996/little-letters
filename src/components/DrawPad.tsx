"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const COLORS = ["#ef4444", "#f97316", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"];

/**
 * A finger/mouse drawing square. Remount it (change its `key`) to clear it.
 * `guide` is drawn faintly underneath; `overlay` sits on top without blocking drawing.
 */
export default function DrawPad({
  borderColor,
  guide,
  overlay,
  onFirstStroke,
}: {
  borderColor: string;
  guide?: React.ReactNode;
  overlay?: React.ReactNode;
  onFirstStroke?: () => void;
}) {
  const [color, setColor] = useState(COLORS[3]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const stroked = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  const setup = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const rect = c.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    c.width = rect.width * dpr;
    c.height = rect.height * dpr;
    const ctx = c.getContext("2d")!;
    ctx.scale(dpr, dpr);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  useEffect(() => {
    setup();
    window.addEventListener("resize", setup);
    return () => window.removeEventListener("resize", setup);
  }, [setup]);

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = point(e);
    if (!stroked.current) {
      stroked.current = true;
      onFirstStroke?.();
    }
  };

  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current || !last.current) return;
    const ctx = e.currentTarget.getContext("2d")!;
    const p = point(e);
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.max(10, e.currentTarget.clientWidth / 28);
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  };

  const onUp = () => {
    drawing.current = false;
    last.current = null;
  };

  return (
    <div>
      <div
        className="relative aspect-square w-full overflow-hidden rounded-[2.5rem] border-4 border-dashed bg-white"
        style={{ borderColor }}
      >
        {guide && <div className="pointer-events-none absolute inset-0 grid select-none place-items-center">{guide}</div>}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full touch-none"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        />
        {overlay && <div className="pointer-events-none absolute inset-0">{overlay}</div>}
      </div>
      <div className="mt-4 flex items-center justify-center gap-2">
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            aria-label={`Colour ${c}`}
            className="h-10 w-10 rounded-full border-4 transition-transform"
            style={{ background: c, borderColor: color === c ? "#3b2f4a" : "white", transform: color === c ? "scale(1.15)" : undefined }}
          />
        ))}
      </div>
    </div>
  );
}
