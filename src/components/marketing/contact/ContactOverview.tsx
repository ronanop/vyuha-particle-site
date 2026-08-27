"use client";

import { Mail, Phone } from "lucide-react";
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
          className="min-h-[calc(100svh-4.5rem)] scroll-mt-28 py-20 md:py-32"
        >
          <div className="mx-auto grid w-full max-w-[1400px] items-start gap-10 px-6 md:px-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
            <div className="min-w-0">
              <h1 className="font-display text-[clamp(2.25rem,5vw,4.5rem)] font-medium leading-[0.98] tracking-[-0.045em] text-white">
                {content.title}
              </h1>
              <p className="mt-6 max-w-md border-t border-kintsugi pt-5 text-[15px] leading-relaxed text-white/60">
                {content.formIntro}
              </p>

              <dl className="mt-12 grid grid-cols-2 gap-5 sm:gap-8">
                <div className="min-w-0">
                  <dt className="flex items-center gap-2 font-display text-[12px] font-semibold uppercase tracking-[0.22em] text-white/75">
                    <Mail
                      className="h-4 w-4 shrink-0 text-cyan-300"
                      aria-hidden
                      strokeWidth={2.25}
                    />
                    Email
                  </dt>
                  <dd className="mt-2">
                    <a
                      href={`mailto:${content.email}`}
                      className="break-all font-display text-[clamp(0.95rem,2vw,1.5rem)] font-semibold tracking-[-0.02em] text-white transition-colors hover:text-cyan-300"
                    >
                      {content.email}
                    </a>
                  </dd>
                </div>
                <div className="min-w-0">
                  <dt className="flex items-center gap-2 font-display text-[12px] font-semibold uppercase tracking-[0.22em] text-white/75">
                    <Phone
                      className="h-4 w-4 shrink-0 text-cyan-300"
                      aria-hidden
                      strokeWidth={2.25}
                    />
                    Phone
                  </dt>
                  <dd className="mt-2">
                    <a
                      href={content.phoneHref}
                      className="font-display text-[clamp(0.95rem,2vw,1.5rem)] font-semibold tracking-[-0.02em] text-white transition-colors hover:text-cyan-300"
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

        <section
          aria-labelledby="discuss-heading"
          className="border-t border-white/10 pb-24 pt-16 md:pb-32 md:pt-20"
        >
          <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
            <h2
              id="discuss-heading"
              className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-medium tracking-[-0.03em] text-white"
            >
              {content.discussTitle}
            </h2>

            <ul className="mt-10 grid grid-cols-1 gap-4 md:mt-12 md:grid-cols-3 md:gap-5">
              {content.discussTopics.map((topic) => (
                <li
                  key={topic.title}
                  className="relative overflow-hidden border border-white/10 bg-white/[0.035] p-7 backdrop-blur-sm md:min-h-[11.5rem] md:p-8"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_48%)]"
                  />
                  <h3 className="relative font-display text-[clamp(1.15rem,1.8vw,1.35rem)] font-medium tracking-[-0.02em] text-white">
                    {topic.title}
                  </h3>
                  <p className="relative mt-3 text-[15px] leading-relaxed text-white/55">
                    {topic.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </article>
    </>
  );
}
