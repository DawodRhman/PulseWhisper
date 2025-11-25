"use client";
import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

const MouseFollower = () => {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith("/admin")) {
      return undefined;
    }

    const moveCursor = (e) => {
      const { clientX: x, clientY: y } = e;

      // Outer circle follows smoothly with a slightly slower duration
      gsap.to(outerRef.current, {
        x,
        y,
        duration: 0.6, // Slower movement for outer circle
        ease: "power2.out",
        overwrite: true, // Ensures no conflicts with previous animations
      });

      // Inner dot follows with a bit faster duration
      gsap.to(innerRef.current, {
        x,
        y,
        duration: 0.15, // Inner dot follows faster but still smooth
        ease: "power2.out",
        overwrite: true, // Ensures no conflicts with previous animations
      });
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [pathname]);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      {/* Outer Circle */}
      <div
        ref={outerRef}
        className="fixed top-0 left-0 w-10 h-10 border-2 border-blue-500 rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-[999] mix-blend-normal"
      />

      {/* Inner Dot */}
      <div
        ref={innerRef}
        className="fixed top-0 left-0 w-2 h-2 bg-blue-500 rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2 z-[999] mix-blend-normal"
      />
    </>
  );
};

export default MouseFollower;
