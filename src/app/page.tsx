import { Hero } from "@/components/Hero";
import { Philosophy } from "@/components/Philosophy";
import Link from "next/link";

const steps = [
  {
    label: "Landscape",
    title: "Understand the topic first",
    body: "Start with the concepts, fields, and tensions that shape the research area.",
  },
  {
    label: "Debates",
    title: "See what researchers disagree about",
    body: "SourceWise turns a topic into major arguments before showing academic papers.",
  },
  {
    label: "Sources",
    title: "Read with purpose",
    body: "Curated sources appear only after you know why each one matters.",
  },
];

export default function Home() {
  return (
    <main className="aura-bg min-h-screen overflow-hidden text-[#171717]">
      <Hero />
      <Philosophy />

      <section className="px-6 py-24 sm:px-10" id="workflow">
        <div className="mx-auto max-w-6xl">
          <div className="animate-rise mb-14">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#57718f]">
                How it works
              </p>
              <h2 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
                From confusion to clarity.
              </h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <article
                className="animate-card rounded-[8px] border border-black/10 bg-white/75 p-7 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5"
                key={step.label}
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <div className="mb-8 flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#57718f]">
                    {step.label}
                  </p>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e6edff] text-sm font-semibold text-[#6b5fa5]">
                    {index + 1}
                  </span>
                </div>
                <h3 className="mb-4 text-2xl font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="text-base leading-7 text-black/60">{step.body}</p>
              </article>
            ))}
          </div>

        </div>
      </section>

      <section className="px-6 pb-24 sm:px-10">
        <div className="animate-card mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 rounded-[8px] border border-black/10 bg-[#171717] p-8 text-white shadow-2xl shadow-black/10 sm:p-12 md:flex-row md:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-white/50">
              Begin
            </p>
            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
              Start with a topic. Leave with a research path.
            </h2>
          </div>
          <Link
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-white/90"
            href="/research"
          >
            Start Research
          </Link>
        </div>
      </section>
    </main>
  );
}
