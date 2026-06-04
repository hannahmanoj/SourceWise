type ResearchInputProps = {
  topic: string;
};

export function ResearchInput({ topic }: ResearchInputProps) {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-10 pt-8 sm:px-10">
      <div className="rounded-[8px] border border-black/10 bg-white/75 p-5 shadow-sm backdrop-blur">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-[#446b70]">
          Step 1
        </p>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-black/50">Research topic</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">
              {topic}
            </h1>
          </div>
          <button className="h-11 rounded-full border border-black/10 bg-[#f7f5f0] px-5 text-sm font-medium text-black transition hover:bg-white">
            Change topic
          </button>
        </div>
      </div>
    </section>
  );
}
