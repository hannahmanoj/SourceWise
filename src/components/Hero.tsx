import Link from "next/link";
import { AuthLinks } from "@/components/AuthLinks";

const heroTitle = "Research without the overwhelm.";
const heroTitleWords = heroTitle.split(" ");
const demoTopic = "Type 2 diabetes medication adherence";
const demoThemes = [
  ["Adherence barriers", "mixed evidence", "3 papers"],
  ["Digital reminders", "emerging", "4 papers"],
  ["Patient education", "mostly agreed", "5 papers"],
];
const demoPapers = [
  ["Medication adherence in type 2 diabetes", "2,146 citations"],
  ["Mobile health reminders for chronic care", "928 citations"],
  ["Patient education and glycemic control", "681 citations"],
];

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden px-6 pb-20 pt-6 sm:px-10 lg:pb-24">
      <div className="absolute inset-0 -z-10">
        <div className="aura-bg absolute inset-0" />
        <div className="absolute inset-x-0 top-0 h-28 bg-white/35" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-black/10" />
      </div>

      <div className="mx-auto w-full max-w-6xl">
        <nav className="animate-rise mb-16 grid grid-cols-[1fr_auto_1fr] items-center rounded-full border border-black/10 bg-white/55 px-4 py-3 text-sm text-black/60 shadow-sm backdrop-blur-md sm:px-5">
          <Link
            className="font-semibold text-black"
            href="/"
            aria-label="SourceWise home"
          >
            SourceWise
          </Link>
          <div className="hidden items-center gap-8 font-semibold sm:flex">
            <a className="transition hover:text-black" href="#philosophy">
              Philosophy
            </a>
            <a className="transition hover:text-black" href="#workflow">
              Workflow
            </a>
            <Link className="transition hover:text-black" href="/research">
              Research
            </Link>
          </div>
          <div className="flex items-center justify-end gap-4 font-semibold">
            <div className="hidden items-center gap-4 sm:flex">
              <AuthLinks />
            </div>
            <Link className="sm:hidden" href="/auth">
              Login
            </Link>
          </div>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_520px] lg:items-center">
          <div>
            <p
              className="animate-rise mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#57718f]"
              style={{ animationDelay: "120ms" }}
            >
              AI-guided research discovery
            </p>
          <h1
            aria-label={heroTitle}
            className="max-w-4xl text-5xl font-semibold tracking-tight text-balance sm:text-7xl lg:text-8xl"
          >
            <span aria-hidden="true">
              {heroTitleWords.map((word, wordIndex) => (
                <span className="inline" key={word}>
                  <span className="inline-block whitespace-nowrap">
                    {Array.from(word).map((character, characterIndex) => {
                      const previousLetters = heroTitleWords
                        .slice(0, wordIndex)
                        .join("").length;
                      const letterIndex =
                        previousLetters + wordIndex + characterIndex;

                      return (
                        <span
                          className="letter-reveal"
                          key={`${word}-${character}-${characterIndex}`}
                          style={{
                            animationDelay: `${180 + letterIndex * 28}ms`,
                          }}
                        >
                          {character}
                        </span>
                      );
                    })}
                  </span>
                  {wordIndex < heroTitleWords.length - 1 ? " " : null}
                </span>
              ))}
            </span>
          </h1>
          <p
            className="animate-rise mt-8 max-w-2xl text-xl leading-8 text-black/60"
            style={{ animationDelay: "980ms" }}
          >
            SourceWise helps students discover, evaluate and understand
            academic sources before they start writing.
          </p>

          <div
            className="animate-rise mt-10 flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "1120ms" }}
          >
            <Link
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#171717] px-6 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-black"
              href="/research"
            >
              Start Research
            </Link>
            <a
              className="inline-flex h-12 items-center justify-center rounded-full border border-black/10 bg-white/65 px-6 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-white"
              href="#workflow"
            >
              See how it works
            </a>
          </div>

          <div
            className="animate-rise mt-12 grid max-w-xl grid-cols-3 gap-3 text-sm text-black/55"
            style={{ animationDelay: "1260ms" }}
          >
            {["Landscape first", "Debates mapped", "Sources ranked"].map(
              (item) => (
                <div
                  className="border-l border-black/15 pl-3 font-medium"
                  key={item}
                >
                  {item}
                </div>
              ),
            )}
          </div>
        </div>

        <div className="animate-preview-panel relative rounded-[8px] border border-black/10 bg-white/75 p-4 shadow-2xl shadow-black/10 backdrop-blur sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#9fc7f0]" />
              <span className="h-3 w-3 rounded-full bg-[#c6b4ef]" />
              <span className="h-3 w-3 rounded-full bg-[#9bd7ad]" />
            </div>
            <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-black/50">
              Live demo
            </span>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[8px] border border-black/10 bg-[#f2f7fb] p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#57718f]">
                Demo search
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="min-w-0 flex-1 rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black/72">
                  <span
                    className="typing-demo"
                    style={{ ["--typing-characters" as string]: demoTopic.length }}
                  >
                    {demoTopic}
                  </span>
                </div>
                <div className="demo-click-button flex h-11 shrink-0 items-center justify-center rounded-full bg-[#171717] px-5 text-sm font-semibold text-white">
                  Map topic
                </div>
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-[1fr_0.9fr]">
              <div className="demo-step-map rounded-[8px] border border-black/10 bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#57718f]">
                      Topic map
                    </p>
                    <h2 className="mt-2 text-xl font-semibold tracking-tight">
                      Diabetes adherence
                    </h2>
                  </div>
                  <span className="rounded-full bg-[#e9f0ff] px-3 py-1 text-xs font-semibold text-[#6b5fa5]">
                    Bachelor level
                  </span>
                </div>

                <div className="space-y-2">
                  {demoThemes.map(([theme, status, count], index) => (
                    <div
                      className="demo-step-item rounded-[8px] border border-black/10 bg-[#f8fbff] p-3"
                      key={theme}
                      style={{ animationDelay: `${6350 + index * 140}ms` }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold">{theme}</p>
                        <span className="shrink-0 text-xs font-semibold text-[#4f7b61]">
                          {count}
                        </span>
                      </div>
                      <p className="mt-2 text-xs font-semibold text-black/42">
                        {status}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3">
                <div className="demo-step-papers rounded-[8px] border border-black/10 bg-[#ecf7f0] p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#4f7b61]">
                    Ranked papers
                  </p>
                  <div className="space-y-2">
                    {demoPapers.map(([paper, citations], index) => (
                      <div
                        className="demo-step-item rounded-[8px] bg-white/80 p-3"
                        key={paper}
                        style={{ animationDelay: `${7350 + index * 140}ms` }}
                      >
                        <p className="text-sm font-semibold leading-5">
                          {paper}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-black/42">
                          {citations}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="demo-step-debate rounded-[8px] border border-black/10 bg-[#171717] p-4 text-white">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
                    Debate found
                  </p>
                  <p className="text-sm font-semibold leading-6">
                    Do digital reminders improve adherence, or do education and
                    clinical support matter more?
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[8px] border border-[#b9d6c5]/60 bg-[#f0fbf3] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4f7b61]">
                What SourceWise does
              </p>
              <p className="mt-2 text-sm leading-6 text-black/65">
                Turns a broad medical topic into themes, ranked papers,
                credibility signals, and debates before you start reading.
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
