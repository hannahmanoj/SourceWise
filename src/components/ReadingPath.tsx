type ReadingPathProps = {
  items: string[];
};

export function ReadingPath({ items }: ReadingPathProps) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
      <div className="mb-8">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-[#446b70]">
          Step 4
        </p>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
          A suggested reading path.
        </h2>
      </div>

      <div className="rounded-[8px] border border-black/10 bg-white/75 p-6 shadow-sm backdrop-blur">
        <div className="space-y-4">
          {items.map((item, index) => (
            <div className="flex gap-4" key={item}>
              <div className="flex flex-col items-center">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#171717] text-sm font-medium text-white">
                  {index + 1}
                </span>
                {index < items.length - 1 ? (
                  <span className="h-10 w-px bg-black/10" />
                ) : null}
              </div>
              <div className="pt-1">
                <h3 className="text-xl font-semibold tracking-tight">{item}</h3>
                <p className="mt-1 text-sm leading-6 text-black/55">
                  Read this stage when you are ready for the next layer of
                  understanding.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
