import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [clickPositions, setClickPositions] = useState<{ x: number, y: number, id: number }[]>([]);

  useEffect(() => {
    let clickId = 0;

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'button' ||
        target.tagName.toLowerCase() === 'a' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      const newClick = { x: e.clientX, y: e.clientY, id: clickId++ };
      setClickPositions(prev => [...prev, newClick]);
      
      // Remove click ripple after animation
      setTimeout(() => {
        setClickPositions(prev => prev.filter(c => c.id !== newClick.id));
      }, 1000);
    };

    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Only show custom cursor on desktop/mouse devices
  const [isDesktop, setIsDesktop] = useState(true);
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsDesktop(!isTouchDevice);
  }, []);

  if (!isDesktop) return null;

  return (
    <>
      <style>
        {`
          body {
            cursor: none !important;
          }
          a, button, [role="button"], input, select, textarea {
            cursor: none !important;
          }
        `}
      </style>
      
      {/* Inner Dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-indigo-500 rounded-full pointer-events-none z-[9999] mix-blend-screen shadow-[0_0_10px_rgba(99,102,241,0.8)]"
        animate={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
          scale: isClicking ? 0.7 : isHovering ? 1.5 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 700,
          damping: 28,
          mass: 0.5,
        }}
      />

      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-indigo-400/50 rounded-full pointer-events-none z-[9998]"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isClicking ? 1.3 : isHovering ? 1.8 : 1,
          opacity: isClicking ? 0.4 : isHovering ? 1 : 0.6,
          backgroundColor: isHovering ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
          mass: 0.8,
        }}
      />

      {/* Click Ripple Effects */}
      <AnimatePresence>
        {clickPositions.map(click => (
          <motion.div
            key={click.id}
            initial={{ scale: 0.5, opacity: 0.8, borderWidth: '2px' }}
            animate={{ scale: 3, opacity: 0, borderWidth: '0px' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="fixed top-0 left-0 w-8 h-8 border-indigo-400 rounded-full pointer-events-none z-[9997]"
            style={{
              x: click.x - 16,
              y: click.y - 16,
            }}
          />
        ))}
      </AnimatePresence>
    </>
  );
};
