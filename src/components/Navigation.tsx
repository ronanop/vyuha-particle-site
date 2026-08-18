"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PRIMARY_NAV } from "@/lib/sitemap";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const LABEL_EASE: [number, number, number, number] = [0.22, 0.61, 0.36, 1];

function AppearLabel({ text }: { text: string }) {
  const reduce = useReducedMotion();
  return (
    <span className="inline-flex overflow-hidden" aria-hidden>
      {Array.from(text).map((ch, i) => (
        <motion.span
          key={`${text}-${i}`}
          className="inline-block"
          initial={
            reduce
              ? false
              : { opacity: 0.001, y: 10, filter: "blur(6px)", scale: 0.98 }
          }
          animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
          transition={{
            delay: i * 0.05,
            duration: 0.5,
            ease: LABEL_EASE,
          }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

export function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const pillRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (!pillRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const links = PRIMARY_NAV.filter((item) => item.path !== "/book-a-demo");

  return (
    <header className="nav-chrome pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="flex items-start justify-between gap-3 p-3 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] md:p-5">
        <Link
          href={isHome ? "#top" : "/"}
          className="pointer-events-auto relative inline-flex min-h-11 items-center rounded-full px-3.5 py-2 md:px-4"
          aria-label="Vyuha.ai"
          onClick={() => setOpen(false)}
        >
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full bg-[#0f0f11] shadow-[0_18px_50px_-24px_rgba(0,0,0,0.8)]"
            initial={false}
            animate={{ opacity: scrolled ? 1 : 0 }}
            transition={
              reduce ? { duration: 0 } : { duration: 0.45, ease: EASE }
            }
          />
          <Image
            src="/vyuha-logo.png"
            alt="Vyuha.ai"
            width={1297}
            height={393}
            className="relative z-10 h-7 w-auto md:h-8"
            priority
          />
        </Link>

        <motion.div
          ref={pillRef}
          layout
          className={`pointer-events-auto overflow-hidden rounded-[24px] bg-[#0f0f11] shadow-[0_18px_50px_-24px_rgba(0,0,0,0.8)] will-change-transform ${
            open
              ? "w-[min(360px,calc(100vw-1.5rem))]"
              : "w-[min(340px,calc(100vw-5.5rem))]"
          }`}
          transition={
            reduce ? { duration: 0 } : { duration: 0.6, ease: EASE }
          }
        >
          <div className="p-2">
            <nav
              className="flex items-center justify-between rounded-[18px] bg-[#f7f6f3] py-2 pr-2 pl-5"
              aria-label="Site"
            >
              <button
                type="button"
                className="flex h-9 items-center gap-2.5 text-[#0a0a0a]"
                aria-expanded={open}
                aria-controls={menuId}
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((v) => !v)}
              >
                <motion.span
                  aria-hidden
                  className="relative block h-5 w-5"
                  animate={{ rotate: open ? 90 : 0 }}
                  transition={
                    reduce ? { duration: 0 } : { duration: 0.6, ease: EASE }
                  }
                >
                  <motion.span
                    className="absolute left-px top-1.5 block h-px w-[18px] rounded-full bg-[#0a0a0a]"
                    animate={{ rotate: open ? 45 : 0, top: open ? 9 : 6 }}
                    transition={
                      reduce ? { duration: 0 } : { duration: 0.6, ease: EASE }
                    }
                  />
                  <motion.span
                    className="absolute left-px top-3 block h-px w-[18px] rounded-full bg-[#0a0a0a]"
                    animate={{ rotate: open ? -45 : 0, top: open ? 9 : 12 }}
                    transition={
                      reduce ? { duration: 0 } : { duration: 0.6, ease: EASE }
                    }
                  />
                </motion.span>
                <span className="min-w-[3.4rem] text-left text-[15px] leading-none font-normal tracking-[-0.01em]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={open ? "close" : "menu"}
                      className="block"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.12 }}
                    >
                      <AppearLabel text={open ? "Close" : "Menu"} />
                      <span className="sr-only">{open ? "Close" : "Menu"}</span>
                    </motion.span>
                  </AnimatePresence>
                </span>
              </button>

              <Link
                href="/book-a-demo"
                className="hidden h-9 items-center rounded-full border border-black/20 px-3.5 text-[12px] tracking-wide text-[#0a0a0a]/80 transition-colors hover:bg-black/[0.08] hover:text-[#0a0a0a] sm:inline-flex"
                onClick={() => setOpen(false)}
              >
                Book a Demo
              </Link>
            </nav>

            <motion.div
              id={menuId}
              initial={false}
              animate={{
                height: open ? "auto" : 0,
                opacity: open ? 1 : 0,
              }}
              transition={
                reduce ? { duration: 0 } : { duration: 0.6, ease: EASE }
              }
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-5 px-[18px] pt-8 pb-6">
                <div>
                  <p className="mb-1.5 text-[13px] text-white/40">Menu</p>
                  <ul className="flex flex-col">
                    {links.map((item) => {
                      const active =
                        pathname === item.path ||
                        pathname.startsWith(`${item.path}/`);
                      return (
                        <li key={item.path}>
                          <Link
                            href={item.path}
                            className={`flex min-h-9 items-center text-[22px] leading-none tracking-[-0.03em] transition-colors ${
                              active
                                ? "text-white"
                                : "text-white/70 hover:text-white"
                            }`}
                            onClick={() => setOpen(false)}
                          >
                            {item.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="h-px bg-white/8" />

                <div>
                  <p className="mb-1.5 text-[13px] text-white/40">Start</p>
                  <Link
                    href="/book-a-demo"
                    className="flex min-h-[30px] items-center text-[15px] text-white/70 transition-colors hover:text-white"
                    onClick={() => setOpen(false)}
                  >
                    Book a Demo
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
