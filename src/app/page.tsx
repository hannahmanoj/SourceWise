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
    <main className="min-h-screen overflow-hidden bg-[#f7f5f0] text-[#171717]">
      <Hero />
      <Philosophy />

      <section className="px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 max-w-3xl">
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-[#446b70]">
              How it works
            </p>
            <h2 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              From confusion to clarity.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <article
                className="rounded-[8px] border border-black/10 bg-white/70 p-7 shadow-sm backdrop-blur"
                key={step.label}
              >
                <p className="mb-8 text-sm font-medium text-[#446b70]">
                  {step.label}
                </p>
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
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 rounded-[8px] border border-black/10 bg-[#171717] p-8 text-white sm:p-12 md:flex-row md:items-center">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-white/50">
              Begin
            </p>
            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
              Start with a topic. Leave with a research path.
            </h2>
          </div>
          <Link
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-medium text-black transition hover:bg-white/90"
            href="/research"
          >
            Start Research
          </Link>
        </div>
      </section>
    </main>
  );
}
