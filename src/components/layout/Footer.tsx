function InstagramIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.8" cy="6.2" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-brand-gray-line bg-brand-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-4 px-4 py-8 text-sm text-neutral-600 sm:px-6">
        <div>
          <p className="font-display tracking-wide text-brand-black">ON DEMAND ORIGINALS</p>
          <p className="mt-2">&copy; {new Date().getFullYear()} On Demand Originals. All rights reserved.</p>
          {/* TODO: contact info, shipping/return policy links — pending client input */}
        </div>
        <a
          href="https://instagram.com/ondemandoriginals"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="On Demand Originals on Instagram"
          className="flex h-12 w-12 items-center justify-center text-brand-black transition-colors hover:text-brand-navy"
        >
          <InstagramIcon />
        </a>
      </div>
    </footer>
  );
}
