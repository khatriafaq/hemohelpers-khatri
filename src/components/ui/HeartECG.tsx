import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

interface HeartECGProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: string;
  isActive?: boolean;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

export default function HeartECG({ 
  className, 
  size = "md", 
  color = "text-blood",
  isActive = true
}: HeartECGProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const phaseRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size based on the container size
    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    // Animation function
    const animate = (time: number) => {
      if (!ctx || !canvas) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate time delta and update phase
      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;
      
      // Update phase based on time (controls animation speed)
      phaseRef.current += deltaTime * 0.002;
      if (phaseRef.current > Math.PI * 2) {
        phaseRef.current -= Math.PI * 2;
      }
      
      // Set line style
      ctx.strokeStyle = isActive ? color : "rgba(200, 200, 200, 0.5)";
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      
      // Draw ECG line
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const amplitude = canvas.height * 0.3;
      
      ctx.beginPath();
      
      // Start from the left edge
      ctx.moveTo(0, centerY);
      
      // Draw the ECG pattern
      for (let x = 0; x < canvas.width; x++) {
        // Base position
        let y = centerY;
        
        // Add ECG pattern
        if (isActive) {
          // Normal heartbeat pattern
          const normalizedX = x / canvas.width;
          const phase = phaseRef.current + normalizedX * Math.PI * 2;
          
          // Base sine wave
          y += Math.sin(phase * 2) * amplitude * 0.2;
          
          // Add ECG spikes
          const spikePhase = (phase % (Math.PI * 2)) / (Math.PI * 2);
          if (spikePhase > 0.1 && spikePhase < 0.15) {
            // R wave (main spike)
            y -= amplitude * (spikePhase - 0.1) * 20;
          } else if (spikePhase > 0.2 && spikePhase < 0.25) {
            // T wave
            y -= amplitude * (spikePhase - 0.2) * 5;
          }
        } else {
          // Flatline for inactive state
          y = centerY;
        }
        
        ctx.lineTo(x, y);
      }
      
      ctx.stroke();
      
      // Continue animation
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [color, isActive]);

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <Heart className={cn("absolute inset-0", color)} />
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-10"
      />
    </div>
  );
} 