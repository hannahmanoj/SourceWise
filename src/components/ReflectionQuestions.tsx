type ReflectionQuestionsProps = {
  questions: string[];
};

export function ReflectionQuestions({ questions }: ReflectionQuestionsProps) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-10 pb-24 sm:px-10">
      <div className="rounded-[8px] border border-black/10 bg-[#f1d89d]/40 p-6 shadow-sm">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-[#6f5b22]">
          Step 5
        </p>
        <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
          Reflection before conclusions.
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {questions.map((question) => (
            <div
              className="rounded-[8px] border border-black/10 bg-white/70 p-5"
              key={question}
            >
              <p className="text-lg font-medium leading-7">{question}</p>
              <div className="mt-5 h-20 rounded-[8px] border border-dashed border-black/15 bg-white/45" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
