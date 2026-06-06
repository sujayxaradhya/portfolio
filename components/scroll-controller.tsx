"use client";

import {
  useEffect,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";

type ScrollControllerProps = {
  progressRef: RefObject<number>;
  totalStops: number;
  onStopChange: (stop: number) => void;
  children: ReactNode;
};

export function ScrollController({
  progressRef,
  totalStops,
  onStopChange,
  children,
}: ScrollControllerProps) {
  const currentStopRef = useRef(0);
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const animate = () => {
      const current = progressRef.current;
      const target = currentStopRef.current;
      const diff = target - current;

      if (Math.abs(diff) < 0.002) {
        progressRef.current = target;
        animFrameRef.current = 0;
        onStopChange(Math.round(target));
        return;
      }

      progressRef.current = current + diff * 0.14;
      animFrameRef.current = requestAnimationFrame(animate);
    };

    const startAnimate = () => {
      if (!animFrameRef.current) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };

    const navigateToStop = (target: number) => {
      const clamped = Math.max(0, Math.min(totalStops - 1, target));
      if (clamped === currentStopRef.current && Math.abs(progressRef.current - clamped) < 0.05) return;
      currentStopRef.current = clamped;
      onStopChange(clamped);
      startAnimate();
    };

    const controller = document.documentElement;

    let wheelAccum = 0;
    let wheelTimeout: ReturnType<typeof setTimeout>;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      wheelAccum += e.deltaY;

      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        wheelAccum = 0;
      }, 200);

      const threshold = 80;
      if (Math.abs(wheelAccum) >= threshold) {
        const direction = wheelAccum > 0 ? 1 : -1;
        wheelAccum = 0;
        navigateToStop(currentStopRef.current + direction);
      }
    };

    let touchStartY = 0;
    let touchHandled = false;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchHandled = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (touchHandled) return;

      const deltaY = touchStartY - e.touches[0].clientY;
      if (deltaY > 55) {
        touchHandled = true;
        navigateToStop(currentStopRef.current + 1);
      } else if (deltaY < -55) {
        touchHandled = true;
        navigateToStop(currentStopRef.current - 1);
      }
    };

    const handleTouchEnd = () => {
      touchStartY = 0;
      touchHandled = false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        navigateToStop(currentStopRef.current + 1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        navigateToStop(currentStopRef.current - 1);
      }
    };

    controller.addEventListener("wheel", handleWheel, { passive: false });
    controller.addEventListener("touchstart", handleTouchStart, { passive: true });
    controller.addEventListener("touchmove", handleTouchMove, { passive: false });
    controller.addEventListener("touchend", handleTouchEnd);
    controller.addEventListener("keydown", handleKeyDown);

    progressRef.current = 0;

    return () => {
      controller.removeEventListener("wheel", handleWheel);
      controller.removeEventListener("touchstart", handleTouchStart);
      controller.removeEventListener("touchmove", handleTouchMove);
      controller.removeEventListener("touchend", handleTouchEnd);
      controller.removeEventListener("keydown", handleKeyDown);
      clearTimeout(wheelTimeout);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [totalStops, progressRef, onStopChange]);

  return <>{children}</>;
}