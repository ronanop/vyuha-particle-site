"use client";

import { ContactForm } from "@/components/marketing/contact/ContactForm";
import type { ContactContent } from "@/content/contact";

export function ContactOverviewView({ content }: { content: ContactContent }) {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, #0a1a1f 0%, #000000 55%, #050505 100%)",
        }}
      />

      <article className="relative z-10">
        <section
          id="contact-form"
          className="min-h-[calc(100svh-4.5rem)] scroll-mt-28 py-24 md:py-32"
        >
          <div className="mx-auto grid w-full max-w-[1400px] items-start gap-12 px-6 md:px-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
            <div>
              <p className="mb-5 font-display text-[11px] font-medium uppercase tracking-[0.28em] text-cyan-400/80">
                {content.eyebrow}
              </p>
              <h1 className="font-display text-[clamp(2.4rem,5vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.045em] text-white">
                {content.title}
              </h1>
              <p className="mt-6 max-w-md border-t border-kintsugi pt-5 text-[15px] leading-relaxed text-white/60">
                {content.formIntro}
              </p>

              <dl className="mt-12 space-y-8">
                <div>
                  <dt className="font-display text-[11px] uppercase tracking-[0.22em] text-white/40">
                    Email
                  </dt>
                  <dd className="mt-2">
                    <a
                      href={`mailto:${content.email}`}
                      className="font-display text-[clamp(1.1rem,2vw,1.5rem)] font-medium tracking-[-0.02em] text-white transition-colors hover:text-cyan-300"
                    >
                      {content.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-display text-[11px] uppercase tracking-[0.22em] text-white/40">
                    Phone
                  </dt>
                  <dd className="mt-2">
                    <a
                      href={content.phoneHref}
                      className="font-display text-[clamp(1.1rem,2vw,1.5rem)] font-medium tracking-[-0.02em] text-white transition-colors hover:text-cyan-300"
                    >
                      {content.phone}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            <ContactForm content={content} />
          </div>
        </section>
      </article>
    </>
  );
}
