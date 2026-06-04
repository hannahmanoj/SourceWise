const principles = [
  "Understand the landscape before opening papers.",
  "See debates before collecting citations.",
  "Use AI to guide thinking, not replace it.",
];

export function Philosophy() {
  return (
    <section className="px-6 py-24 sm:px-10" id="philosophy">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-[#446b70]">
            Philosophy
          </p>
          <h2 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            AI should make research clearer, not do the thinking for you.
          </h2>
        </div>

        <div className="space-y-4">
          {principles.map((principle, index) => (
            <div
              className="rounded-[8px] border border-black/10 bg-white/65 p-6 shadow-sm backdrop-blur"
              key={principle}
            >
              <p className="mb-4 text-sm font-medium text-[#446b70]">
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
