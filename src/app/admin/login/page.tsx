"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 px-4 py-24">
      <h1 className="text-center text-2xl font-bold">Admin Login</h1>
      <form action={formAction} className="flex flex-col gap-4">
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="rounded border border-neutral-300 px-3 py-2 text-sm"
        />
        <input
          type="password"
          name="password"
          required
          placeholder="Password"
          className="rounded border border-neutral-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-brand-navy px-4 py-2 text-sm font-medium text-brand-white hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Signing in..." : "Sign In"}
        </button>
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      </form>
    </div>
  );
}
