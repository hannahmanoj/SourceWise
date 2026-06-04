type ResearchMapProps = {
  topic: string;
  themes: string[];
  debates: { question: string }[];
};

export function ResearchMap({ topic, themes, debates }: ResearchMapProps) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
      <div className="mb-8">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-[#446b70]">
          Step 2
        </p>
        <h2 className="text-4xl font-semibold tracking-tight sm:text-6xl">
          See the research map.
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-black/60">
          SourceWise starts with the landscape, not a stack of papers. First,
          understand the themes and debates shaping the topic.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative min-h-[460px] overflow-hidden rounded-[8px] border border-black/10 bg-white/75 p-6 shadow-sm backdrop-blur">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(68,107,112,0.12),transparent_58%)]" />
          <div className="absolute left-1/2 top-1/2 h-px w-[75%] -translate-x-1/2 bg-black/10" />
          <div className="absolute left-1/2 top-[28%] h-[42%] w-px -translate-x-1/2 bg-black/10" />

          <div className="relative flex h-full min-h-[410px] items-center justify-center">
            <div className="z-10 max-w-[230px] rounded-full border border-[#446b70]/20 bg-[#f7f5f0] px-8 py-6 text-center shadow-lg shadow-black/10">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#446b70]">
                Topic
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                {topic}
              </h3>
            </div>

            {themes.map((theme, index) => {
              const positions = [
                "left-6 top-10",
                "right-6 top-16",
                "left-10 bottom-14",
                "right-10 bottom-10",
              ];

              return (
                <div
                  className={`absolute ${positions[index]} rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium shadow-sm`}
                  key={theme}
                >
                  {theme}
                </div>
              );
            })}
          </div>
        </div>

        <aside className="rounded-[8px] border border-black/10 bg-[#171717] p-6 text-white shadow-sm">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-white/45">
            Major debates
          </p>
          <div className="space-y-3">
            {debates.map((debate, index) => (
              <div
                className="rounded-[8px] border border-white/10 bg-white/[0.06] p-4"
                key={debate.question}
              >
                <p className="mb-3 text-sm font-medium text-[#b8d8dc]">
                  Debate {index + 1}
                </p>
                <p className="text-base leading-7 text-white/80">
                  {debate.question}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
