const principles = [
  "Understand the landscape before opening papers.",
  "See debates before collecting citations.",
  "Use AI to guide your thinking, not replace it.",
];

export function Philosophy() {
  return (
    <section className="px-6 py-24 sm:px-10" id="philosophy">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="animate-rise">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#57718f]">
            Philosophy
          </p>
          <h2 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            AI should make research clearer, not do the thinking for you.
          </h2>
        </div>

        <div className="space-y-4">
          {principles.map((principle, index) => (
            <div
              className="animate-card grid gap-5 rounded-[8px] border border-black/10 bg-white/70 p-6 shadow-sm backdrop-blur sm:grid-cols-[72px_1fr] sm:items-center"
              key={principle}
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <p className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e6edff] text-sm font-semibold text-[#6b5fa5]">
                0{index + 1}
              </p>
              <p className="text-2xl font-medium leading-snug">{principle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
