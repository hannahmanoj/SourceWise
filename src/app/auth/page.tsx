import Link from "next/link";
import type { ReactNode } from "react";
import { login, signup } from "@/app/auth/actions";

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; mode?: string; next?: string }>;
}) {
  const params = await searchParams;
  const next =
    params.next && params.next.startsWith("/") && !params.next.startsWith("//")
      ? params.next
      : "/research/saved";
  const mode = params.mode === "signup" ? "signup" : "login";

  return (
    <main className="aura-bg min-h-screen px-6 py-8 text-[#171717] sm:px-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 flex items-center justify-between gap-4">
          <Link className="text-sm font-semibold" href="/">
            SourceWise
          </Link>
          <Link
            className="inline-flex h-10 items-center rounded-full border border-black/10 bg-white/70 px-4 text-sm font-semibold transition hover:bg-white"
            href="/research"
          >
            Research
          </Link>
        </header>

        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="animate-rise">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#57718f]">
              SourceWise account
            </p>
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              Save research topics and come back later.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-black/60">
              Sign in before mapping a topic and SourceWise will save the
              research map, ranked papers, credibility signals, and debates.
            </p>
          </div>

          <div className="animate-card rounded-[8px] border border-black/10 bg-white/80 p-5 shadow-xl shadow-black/[0.06] backdrop-blur sm:p-7">
            {params.message ? (
              <p className="mb-5 rounded-[8px] border border-[#b9d6c5]/60 bg-[#f0fbf3] px-4 py-3 text-sm font-semibold text-[#4f7b61]">
                {params.message}
              </p>
            ) : null}

            {mode === "signup" ? (
              <AuthForm
                action={signup}
                buttonLabel="Sign Up"
                footer={
                  <>
                    Already have an account?{" "}
                    <Link
                      className="font-semibold text-[#6b5fa5] transition hover:text-black"
                      href={`/auth?mode=login&next=${encodeURIComponent(next)}`}
                    >
                      Login
                    </Link>
                  </>
                }
                next={next}
                title="Create your account"
              />
            ) : (
              <AuthForm
                action={login}
                buttonLabel="Login"
                footer={
                  <>
                    New here?{" "}
                    <Link
                      className="font-semibold text-[#6b5fa5] transition hover:text-black"
                      href={`/auth?mode=signup&next=${encodeURIComponent(next)}`}
                    >
                      Sign Up
                    </Link>
                  </>
                }
                next={next}
                title="Welcome back"
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function AuthForm({
  action,
  buttonLabel,
  footer,
  next,
  title,
}: {
  action: (formData: FormData) => Promise<void>;
  buttonLabel: string;
  footer: ReactNode;
  next: string;
  title: string;
}) {
  return (
    <form
      action={action}
      className="rounded-[8px] border border-[#9f8ee8]/60 bg-white p-4 shadow-lg shadow-black/[0.04] transition"
    >
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <input name="next" type="hidden" value={next} />
      <label className="mt-5 block">
        <span className="mb-2 block text-sm font-semibold text-black/55">
          Email
        </span>
        <input
          className="h-11 w-full rounded-[8px] border border-black/10 bg-white px-4 text-sm font-semibold outline-none transition focus:border-[#6b5fa5] focus:ring-4 focus:ring-[#ded9ff]"
          name="email"
          required
          type="email"
        />
      </label>
      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-semibold text-black/55">
          Password
        </span>
        <input
          className="h-11 w-full rounded-[8px] border border-black/10 bg-white px-4 text-sm font-semibold outline-none transition focus:border-[#6b5fa5] focus:ring-4 focus:ring-[#ded9ff]"
          minLength={6}
          name="password"
          required
          type="password"
        />
      </label>
      <button
        className="mt-5 h-11 w-full rounded-full bg-[#171717] px-5 text-sm font-semibold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-black"
        type="submit"
      >
        {buttonLabel}
      </button>
      <p className="mt-5 text-center text-sm font-semibold text-black/55">
        {footer}
      </p>
    </form>
  );
}
