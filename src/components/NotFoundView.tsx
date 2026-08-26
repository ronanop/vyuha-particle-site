import { FluidButton } from "@/components/FluidButton";

export function NotFoundView() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse at 50% 35%, #0a1a1f 0%, #000000 55%, #050505 100%)",
        }}
      />

      <section className="relative z-10 flex min-h-[calc(100svh-4.5rem)] items-center py-20 md:py-32">
        <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
          <p className="mb-5 font-display text-[11px] font-medium uppercase tracking-[0.28em] text-cyan-400/80">
            Error 404
          </p>
          <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] font-medium leading-[0.95] tracking-[-0.045em] text-white">
            Page not found
          </h1>
          <p className="mt-6 max-w-md border-t border-kintsugi pt-5 text-[15px] leading-relaxed text-white/60">
            This page doesn&apos;t exist or may have moved. Head back to the
            homepage to keep exploring Vyuha.
          </p>
          <div className="mt-10">
            <FluidButton text="Go to homepage" href="/" />
          </div>
        </div>
      </section>
    </>
  );
}
