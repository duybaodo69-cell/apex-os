/**
 * APEX: Executive RPG Execution OS
 * Interactive 4-Axis Diamond Radar Canvas (Solo Leveling System Stats)
 *
 * File target: src/components/visuals/StatRadarCanvas.tsx
 */

import React, { useEffect, useRef } from 'react';
import { CharacterAttributes } from '../../types';

interface StatRadarCanvasProps {
  attributes: CharacterAttributes;
  size?: number;
  className?: string;
}

export const StatRadarCanvas: React.FC<StatRadarCanvasProps> = ({
  attributes,
  size = 240,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Support High-DPI screens
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.38;

    ctx.clearRect(0, 0, size, size);

    // 1. Draw Concentric 4-Axis Grid Rings (Levels 25%, 50%, 75%, 100%)
    const ringLevels = [0.25, 0.5, 0.75, 1.0];
    ringLevels.forEach((level) => {
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - radius * level);
      ctx.lineTo(centerX + radius * level, centerY);
      ctx.lineTo(centerX, centerY + radius * level);
      ctx.lineTo(centerX - radius * level, centerY);
      ctx.closePath();

      ctx.strokeStyle = level === 1.0 ? 'rgba(0, 240, 255, 0.35)' : 'rgba(51, 65, 85, 0.4)';
      ctx.lineWidth = level === 1.0 ? 1.5 : 1;
      ctx.stroke();
    });

    // 2. Draw Cross Axes
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius);
    ctx.lineTo(centerX, centerY + radius);
    ctx.moveTo(centerX - radius, centerY);
    ctx.lineTo(centerX + radius, centerY);
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 3. Compute Normalized Attribute Values (Scale 0 to 50 max for visual polygon)
    const maxVal = 50;
    const strNorm = Math.min(1, Math.max(0.15, attributes.strategicMind / maxVal));
    const engNorm = Math.min(1, Math.max(0.15, attributes.englishRhetoric / maxVal));
    const finNorm = Math.min(1, Math.max(0.15, attributes.financeIQ / maxVal));
    const staNorm = Math.min(1, Math.max(0.15, attributes.gritStamina / maxVal));

    // Polygon coordinates
    const pTop = { x: centerX, y: centerY - radius * strNorm };
    const pRight = { x: centerX + radius * engNorm, y: centerY };
    const pBottom = { x: centerX, y: centerY + radius * finNorm };
    const pLeft = { x: centerX - radius * staNorm, y: centerY };

    // 4. Draw Attribute Filled Polygon with Neon Gradient
    let polyGrad: string | CanvasGradient = 'rgba(0, 240, 255, 0.35)';
    if (typeof ctx.createRadialGradient === 'function') {
      try {
        const grad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, radius);
        grad.addColorStop(0, 'rgba(0, 240, 255, 0.4)');
        grad.addColorStop(0.6, 'rgba(139, 92, 246, 0.35)');
        grad.addColorStop(1, 'rgba(16, 185, 129, 0.25)');
        polyGrad = grad;
      } catch {
        // Fallback for limited canvas environments
      }
    }

    ctx.beginPath();
    ctx.moveTo(pTop.x, pTop.y);
    ctx.lineTo(pRight.x, pRight.y);
    ctx.lineTo(pBottom.x, pBottom.y);
    ctx.lineTo(pLeft.x, pLeft.y);
    ctx.closePath();

    ctx.fillStyle = polyGrad;
    ctx.fill();

    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0; // reset shadow

    // 5. Draw Glowing Vertices
    const vertices = [
      { p: pTop, color: '#818cf8', label: 'STR' },
      { p: pRight, color: '#60a5fa', label: 'ENG' },
      { p: pBottom, color: '#34d399', label: 'FIN' },
      { p: pLeft, color: '#fbbf24', label: 'STA' },
    ];

    vertices.forEach(({ p, color }) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#05070f';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    // 6. Draw Text Labels
    if (typeof ctx.fillText === 'function') {
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // STR (North)
      ctx.fillStyle = '#818cf8';
      ctx.fillText(`STR ${attributes.strategicMind}`, centerX, centerY - radius - 14);

      // ENG (East)
      ctx.fillStyle = '#60a5fa';
      ctx.fillText(`ENG ${attributes.englishRhetoric}`, centerX + radius + 24, centerY);

      // FIN (South)
      ctx.fillStyle = '#34d399';
      ctx.fillText(`FIN ${attributes.financeIQ}`, centerX, centerY + radius + 14);

      // STA (West)
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(`STA ${attributes.gritStamina}`, centerX - radius - 24, centerY);
    }
  }, [attributes, size]);

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="drop-shadow-[0_0_15px_rgba(0,240,255,0.15)]"
      />
    </div>
  );
};
