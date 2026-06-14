"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

type AuthAction = "login" | "signup";

export async function login(formData: FormData) {
  await authenticate("login", formData);
}

export async function signup(formData: FormData) {
  await authenticate("signup", formData);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

async function authenticate(action: AuthAction, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = getSafeNextPath(formData.get("next"));

  if (!email || !password) {
    redirectWithMessage("Email and password are required.", next);
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";
  const authResult =
    action === "signup"
      ? await supabase.auth.signUp({
          email,
          options: {
            emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
          },
          password,
        })
      : await supabase.auth.signInWithPassword({ email, password });

  if (authResult.error) {
    redirectWithMessage(authResult.error.message, next);
  }

  if (action === "signup" && !authResult.data.session) {
    redirectWithMessage("Check your email to confirm your SourceWise account.", next);
  }

  redirect(next);
}

function getSafeNextPath(value: FormDataEntryValue | null) {
  const next = String(value ?? "/research/saved");

  if (!next.startsWith("/") || next.startsWith("//")) {
    return "/research/saved";
  }

  return next;
}

function redirectWithMessage(message: string, next: string): never {
  redirect(`/auth?message=${encodeURIComponent(message)}&next=${encodeURIComponent(next)}`);
}
