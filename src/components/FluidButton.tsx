"use client";

import { useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Port of Framer Fluid Button
 * https://framer.com/m/Fluid-Button-TYcP.js@Zhk4D4902uwzpqUJQTaH
 * — rising fill overlay, dual-label slide, optional pulse scale.
 */

const EASE: [number, number, number, number] = [0.4, 0, 0, 1];

export type FluidButtonProps = {
  text: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  newTab?: boolean;
  firstTextColor?: string;
  secondTextColor?: string;
  overlayColor?: string;
  borderColor?: string;
  borderWidth?: number;
  /** Hover peak scale (Framer default 1.05). */
  scale?: number;
  scaleOnHover?: boolean;
  pulseEffect?: boolean;
  className?: string;
  size?: "sm" | "md";
  disabled?: boolean;
  "aria-label"?: string;
};

export function FluidButton({
  text,
  href,
  onClick,
  type = "button",
  newTab = false,
  firstTextColor = "rgb(250, 250, 250)",
  secondTextColor = "rgb(1, 1, 1)",
  overlayColor = "rgb(250, 250, 250)",
  borderColor = "rgb(250, 250, 250)",
  borderWidth = 2,
  scale = 1.05,
  scaleOnHover = true,
  pulseEffect = true,
  className = "",
  size = "md",
  disabled = false,
  "aria-label": ariaLabel,
}: FluidButtonProps) {
  const [hovered, setHovered] = useState(false);
  const reduceMotion = useReducedMotion();
  const duration = reduceMotion ? 0 : 0.5;
  const transition = { duration, ease: EASE };

  const paddingClass =
    size === "sm"
      ? "px-4 py-3 md:px-[22px] md:py-3"
      : "px-5 py-3.5 sm:px-10 sm:py-[18px]";
  const fontSize =
    size === "sm" ? "0.8125rem" : "calc(1rem * 1.05)";

  const sharedStyle: CSSProperties = {
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    borderStyle: "solid",
    borderWidth,
    borderColor,
    textDecoration: "none",
    textShadow: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
  };

  const content = (
    <>
      {/* Rising fill overlay */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 z-0"
        initial={false}
        animate={
          hovered
            ? { top: 0, bottom: "auto", height: "100%", borderRadius: 0 }
            : {
                top: "auto",
                bottom: "-110%",
                height: "110%",
                borderRadius: "50%",
              }
        }
        transition={transition}
        style={{ backgroundColor: overlayColor }}
      />

      {/* Dual label stack — slide by one line (−50% of two-line stack) */}
      <span
        className="relative z-[1] block overflow-hidden"
        style={{ height: "1em", fontSize, textShadow: "none" }}
      >
        <motion.span
          className="flex flex-col"
          initial={false}
          animate={{ y: hovered ? "-50%" : "0%" }}
          transition={transition}
        >
          <span
            className="block h-[1em] whitespace-nowrap font-medium leading-none"
            style={{
              color: firstTextColor,
              textShadow: "none",
            }}
          >
            {text}
          </span>
          <span
            className="block h-[1em] whitespace-nowrap font-medium leading-none"
            style={{
              color: secondTextColor,
              textShadow: "none",
            }}
            aria-hidden
          >
            {text}
          </span>
        </motion.span>
      </span>
    </>
  );

  const motionProps = {
    className: `relative inline-flex max-w-full items-center justify-center overflow-hidden will-change-transform ${paddingClass} ${className}`,
    style: sharedStyle,
    onHoverStart: () => !disabled && setHovered(true),
    onHoverEnd: () => setHovered(false),
    onFocus: () => !disabled && setHovered(true),
    onBlur: () => setHovered(false),
    animate:
      !reduceMotion && scaleOnHover && hovered
        ? pulseEffect
          ? { scale: [1, scale, 1] }
          : { scale }
        : { scale: 1 },
    transition: pulseEffect
      ? { duration, ease: EASE, times: [0, 0.65, 1] }
      : transition,
  };

  if (href) {
    return (
      <motion.a
        {...motionProps}
        href={disabled ? undefined : href}
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noopener noreferrer" : undefined}
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        onClick={disabled ? (e) => e.preventDefault() : onClick}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button
      {...motionProps}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {content}
    </motion.button>
  );
}
