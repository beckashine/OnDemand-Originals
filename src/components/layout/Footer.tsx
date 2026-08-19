export default function Footer() {
  return (
    <footer className="border-t border-brand-gray-line bg-brand-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-600 sm:px-6">
        <p className="font-display tracking-wide text-brand-black">ON DEMAND ORIGINALS</p>
        <p className="mt-2">&copy; {new Date().getFullYear()} On Demand Originals. All rights reserved.</p>
        {/* TODO: contact info, shipping/return policy links, social links — pending client input */}
      </div>
    </footer>
  );
}
