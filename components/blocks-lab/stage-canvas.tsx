'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { StageState, SpriteState } from './command-interpreter';

interface StageCanvasProps {
  state: StageState;
  width?: number;
  height?: number;
}

export default function StageCanvas({
  state,
  width = 480,
  height = 360,
}: StageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawSprite = useCallback((ctx: CanvasRenderingContext2D, sprite: SpriteState) => {
    if (!sprite.visible) return;

    const baseSize = 50;
    const size = (sprite.size / 100) * baseSize;
    const x = sprite.x;
    const y = sprite.y;

    // Apply bounce "squish" animation
    let scaleX = 1;
    let scaleY = 1;
    if (sprite.bounceTimer > 0) {
      const factor = Math.sin((sprite.bounceTimer / 15) * Math.PI) * 0.3;
      scaleX = 1 + factor;
      scaleY = 1 - factor;
    }
    
    if (sprite.directionX === -1) {
      scaleX *= -1;
    }

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scaleX, scaleY);
    ctx.translate(-x, -y);

    if (sprite.type === 'hare' || sprite.type === 'lion') {
      // Body
      ctx.fillStyle = sprite.type === 'lion' ? '#ea580c' : sprite.color;
      
      // If lion, draw mane
      if (sprite.type === 'lion') {
        ctx.fillStyle = '#9a3412';
        ctx.beginPath();
        ctx.arc(x, y - size * 0.1, size * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ea580c';
      }

      // Main body
      ctx.beginPath();
      const bodyWidth = size;
      const bodyHeight = size * 1.2;
      const radius = size * 0.2;
      
      ctx.moveTo(x - bodyWidth/2 + radius, y - bodyHeight/2);
      ctx.lineTo(x + bodyWidth/2 - radius, y - bodyHeight/2);
      ctx.quadraticCurveTo(x + bodyWidth/2, y - bodyHeight/2, x + bodyWidth/2, y - bodyHeight/2 + radius);
      ctx.lineTo(x + bodyWidth/2, y + bodyHeight/2 - radius);
      ctx.quadraticCurveTo(x + bodyWidth/2, y + bodyHeight/2, x + bodyWidth/2 - radius, y + bodyHeight/2);
      ctx.lineTo(x - bodyWidth/2 + radius, y + bodyHeight/2);
      ctx.quadraticCurveTo(x - bodyWidth/2, y + bodyHeight/2, x - bodyWidth/2, y + bodyHeight/2 - radius);
      ctx.lineTo(x - bodyWidth/2, y - bodyHeight/2 + radius);
      ctx.quadraticCurveTo(x - bodyWidth/2, y - bodyHeight/2, x - bodyWidth/2 + radius, y - bodyHeight/2);
      ctx.closePath();
      ctx.fill();

      // Ears for Hare
      if (sprite.type === 'hare') {
        ctx.fillStyle = sprite.color;
        // Left Ear
        ctx.beginPath();
        ctx.ellipse(x - size * 0.2, y - size * 0.7, size * 0.15, size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        // Right Ear
        ctx.beginPath();
        ctx.ellipse(x + size * 0.2, y - size * 0.7, size * 0.15, size * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Eyes
      ctx.fillStyle = 'white';
      const eyeSize = size * 0.15;
      const eyeY = y - bodyHeight * 0.15;
      
      ctx.beginPath();
      ctx.arc(x - size * 0.15, eyeY, eyeSize, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(x + size * 0.15, eyeY, eyeSize, 0, Math.PI * 2);
      ctx.fill();

      // Pupils
      ctx.fillStyle = '#333';
      const pupilSize = eyeSize * 0.5;
      
      ctx.beginPath();
      ctx.arc(x - size * 0.15, eyeY, pupilSize, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(x + size * 0.15, eyeY, pupilSize, 0, Math.PI * 2);
      ctx.fill();

      // Smile
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y + bodyHeight * 0.1, size * 0.2, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();
    } else if (sprite.type === 'food') {
      ctx.fillStyle = '#ef4444'; // Red apple
      ctx.beginPath();
      ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
      ctx.fill();
      // Stem
      ctx.strokeStyle = '#422006';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, y - size * 0.4);
      ctx.lineTo(x, y - size * 0.7);
      ctx.stroke();
    } else if (sprite.type === 'water') {
      ctx.fillStyle = '#3b82f6'; // Blue drop
      ctx.beginPath();
      ctx.moveTo(x, y - size * 0.6);
      ctx.bezierCurveTo(x + size * 0.5, y, x + size * 0.5, y + size * 0.6, x, y + size * 0.6);
      ctx.bezierCurveTo(x - size * 0.5, y + size * 0.6, x - size * 0.5, y, x, y - size * 0.6);
      ctx.fill();
    } else if (sprite.type === 'home') {
      ctx.fillStyle = '#f59e0b'; // Amber house
      ctx.beginPath();
      // House base
      ctx.rect(x - size * 0.5, y - size * 0.2, size, size * 0.7);
      // Roof
      ctx.moveTo(x - size * 0.6, y - size * 0.2);
      ctx.lineTo(x, y - size * 0.7);
      ctx.lineTo(x + size * 0.6, y - size * 0.2);
      ctx.fill();
      // Door
      ctx.fillStyle = '#422006';
      ctx.fillRect(x - size * 0.15, y + size * 0.2, size * 0.3, size * 0.3);
    }

    ctx.restore();

    // Draw speech bubble if message exists
    if (sprite.message) {
      drawSpeechBubble(ctx, x, y - (size * 0.8), sprite.message);
    }
  }, []);

  const drawSpeechBubble = (ctx: CanvasRenderingContext2D, x: number, y: number, text: string) => {
    ctx.save();
    
    ctx.font = '14px Inter, sans-serif';
    const metrics = ctx.measureText(text);
    const padding = 10;
    const bubbleWidth = Math.min(metrics.width + padding * 2, 200);
    const bubbleHeight = 30;
    
    // Bubble background
    ctx.fillStyle = 'white';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    const bubbleX = Math.max(10, Math.min(x - bubbleWidth/2, (canvasRef.current?.width || 480) - bubbleWidth - 10));
    const bubbleY = Math.max(10, y - bubbleHeight - 10);
    
    // Draw rounded rectangle
    const radius = 8;
    ctx.beginPath();
    ctx.moveTo(bubbleX + radius, bubbleY);
    ctx.lineTo(bubbleX + bubbleWidth - radius, bubbleY);
    ctx.quadraticCurveTo(bubbleX + bubbleWidth, bubbleY, bubbleX + bubbleWidth, bubbleY + radius);
    ctx.lineTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight - radius);
    ctx.quadraticCurveTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight, bubbleX + bubbleWidth - radius, bubbleY + bubbleHeight);
    ctx.lineTo(bubbleX + radius, bubbleY + bubbleHeight);
    ctx.quadraticCurveTo(bubbleX, bubbleY + bubbleHeight, bubbleX, bubbleY + bubbleHeight - radius);
    ctx.lineTo(bubbleX, bubbleY + radius);
    ctx.quadraticCurveTo(bubbleX, bubbleY, bubbleX + radius, bubbleY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Draw pointer
    ctx.beginPath();
    ctx.moveTo(x - 5, bubbleY + bubbleHeight);
    ctx.lineTo(x, bubbleY + bubbleHeight + 8);
    ctx.lineTo(x + 5, bubbleY + bubbleHeight);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.stroke();
    
    // Draw text
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      text.length > 20 ? text.substring(0, 20) + '...' : text,
      bubbleX + bubbleWidth/2,
      bubbleY + bubbleHeight/2
    );
    
    ctx.restore();
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#f0f9ff'; // Light blue background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid (optional, for visual reference)
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    const gridSize = 40;
    
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw center crosshair
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw sprites
    for (const sprite of Object.values(state.sprites)) {
      drawSprite(ctx, sprite);
    }

    // Draw status indicator
    ctx.fillStyle = state.running ? '#22c55e' : '#ef4444';
    ctx.beginPath();
    ctx.arc(canvas.width - 15, 15, 6, 0, Math.PI * 2);
    ctx.fill();
  }, [state, drawSprite]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="relative bg-white rounded-lg shadow-inner border border-gray-200 overflow-hidden">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="block"
        style={{ imageRendering: 'pixelated' }}
      />
      {/* Position indicator */}
      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded font-mono">
        X: {Math.round(state.sprites.main?.x || 0)} Y: {Math.round((height - (state.sprites.main?.y || 0)))}
      </div>
    </div>
  );
}
