import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center px-6 py-24 sm:px-10">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-20 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#d7e8ea]/60 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-64 w-64 rounded-full bg-[#f2d7a7]/50 blur-3xl" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-14 lg:grid-cols-[1fr_420px] lg:items-center">
        <div>
          <nav className="mb-20 flex items-center justify-between text-sm text-black/60">
            <Link className="font-semibold text-black" href="/">
              SourceWise
            </Link>
            <div className="hidden gap-8 sm:flex">
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
          </nav>

          <p className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-[#446b70]">
            AI-guided research discovery
          </p>
          <h1 className="max-w-4xl text-6xl font-semibold tracking-tight sm:text-7xl lg:text-8xl">
            Research without the overwhelm.
          </h1>
          <p className="mt-8 max-w-2xl text-xl leading-8 text-black/60">
            SourceWise helps students discover, evaluate and understand
            academic sources without writing their work.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex h-12 items-center justify-center rounded-full bg-black px-6 text-sm font-medium text-white transition hover:bg-black/85"
              href="/research"
            >
              Start Research
            </Link>
            <a
              className="inline-flex h-12 items-center justify-center rounded-full border border-black/10 bg-white/50 px-6 text-sm font-medium text-black transition hover:bg-white"
              href="#workflow"
            >
              See how it works
            </a>
          </div>
        </div>

        <div className="rounded-[8px] border border-black/10 bg-white/70 p-5 shadow-2xl shadow-black/10 backdrop-blur">
          <div className="mb-5 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff6b5f]" />
            <span className="h-3 w-3 rounded-full bg-[#f6c85f]" />
            <span className="h-3 w-3 rounded-full bg-[#6bcf8f]" />
          </div>
          <div className="rounded-[8px] bg-[#f8f7f4] p-5">
            <p className="text-sm font-medium text-black/50">Your landscape</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              AI in Software Engineering
            </h2>
            <div className="mt-6 space-y-3">
              {["Productivity", "Code Quality", "Developer Learning"].map(
                (theme) => (
                  <div
                    className="flex items-center justify-between rounded-[8px] border border-black/10 bg-white p-4"
                    key={theme}
                  >
                    <span className="text-sm font-medium">{theme}</span>
                    <span className="h-2 w-16 rounded-full bg-[#9fc5c9]" />
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
