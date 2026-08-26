export function Network() {
  return (
    <section
      id="company"
      className="relative z-10 flex min-h-[140vh] flex-col justify-center px-6 py-32 md:px-10"
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <p className="mb-8 text-[13px] uppercase tracking-[0.18em] text-white/50">
          For every team
        </p>
        <h2 className="font-display max-w-[16ch] text-[clamp(2.75rem,6vw,7rem)] font-medium leading-[0.95] tracking-[-0.035em] text-white">
          Make every team AI-capable.
        </h2>
        <p className="mt-10 max-w-xl text-[18px] leading-relaxed text-white/60 md:text-[20px]">
          Particles form the words the organization needs to see — intelligence
          that reaches beyond a single team or tool.
        </p>
        <div className="sr-only">
          <p>AI</p>
          <p>EVERY TEAM</p>
        </div>
      </div>
    </section>
  );
}
