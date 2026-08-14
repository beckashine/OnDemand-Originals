export default function Footer() {
  return (
    <footer className="border-t border-black bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-600">
        <p>&copy; {new Date().getFullYear()} On Demand Originals. All rights reserved.</p>
        {/* TODO: contact info, shipping/return policy links, social links — pending client input */}
      </div>
    </footer>
  );
}
