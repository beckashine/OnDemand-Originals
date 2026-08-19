"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("Request failed");
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="text-[20px] font-bold text-brand-yellow">
        You&rsquo;re on the list — welcome to the team.
      </p>
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mx-auto flex max-w-md gap-2.5">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-13 flex-1 rounded-full border-2 border-neutral-700 bg-brand-white px-5 text-[18px] text-brand-black placeholder-neutral-500 focus:border-brand-yellow focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="h-13 shrink-0 rounded-full bg-brand-yellow px-7 text-[18px] font-extrabold tracking-wide text-brand-black uppercase hover:bg-brand-yellow-dark disabled:opacity-50"
        >
          {status === "submitting" ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-3 text-[18px] text-red-400">Something went wrong. Try again.</p>
      )}
    </div>
  );
}
