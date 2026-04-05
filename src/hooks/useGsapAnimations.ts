import { useEffect } from 'react';
import { gsap } from 'gsap';

/**
 * Hook: staggered fade-up entrance for a container's children
 * @param selector - CSS selector for child elements to animate
 * @param deps - dependency array to re-trigger animation
 */
export function useStaggerEntrance(
  containerRef: React.RefObject<HTMLElement | null>,
  selector = ':scope > *',
  delay = 0
) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current?.querySelectorAll(selector) ?? [],
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: 'power3.out',
          delay,
          clearProps: 'all',
        }
      );
    }, containerRef);
    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * Hook: single element fade+scale entrance
 */
export function useFadeScaleEntrance(
  ref: React.RefObject<HTMLElement | null>,
  delay = 0
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0, scale: 0.96 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out', delay, clearProps: 'all' }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * Hook: slide-in from left (sidebar nav items)
 */
export function useSlideInLeft(
  containerRef: React.RefObject<HTMLElement | null>,
  selector = ':scope > *',
  delay = 0.1
) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current?.querySelectorAll(selector) ?? [],
        { opacity: 0, x: -18 },
        {
          opacity: 1,
          x: 0,
          duration: 0.45,
          stagger: 0.07,
          ease: 'power2.out',
          delay,
          clearProps: 'all',
        }
      );
    }, containerRef);
    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * Animate a number from 0 to target value
 */
export function useCountUp(
  ref: React.RefObject<HTMLElement | null>,
  target: number,
  duration = 1.2,
  delay = 0.2,
  formatter?: (v: number) => string
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || isNaN(target)) return;
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration,
      delay,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = formatter ? formatter(obj.val) : obj.val.toFixed(0);
      },
      onComplete: () => {
        el.textContent = formatter ? formatter(target) : target.toFixed(0);
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);
}
