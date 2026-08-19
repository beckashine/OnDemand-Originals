function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export default function SearchForm({ defaultValue }: { defaultValue?: string }) {
  return (
    <form
      action="/products"
      method="get"
      className="flex h-10 items-center overflow-hidden rounded-full bg-brand-navy pr-1 pl-4 focus-within:bg-brand-navy-dark"
    >
      <label htmlFor="q" className="sr-only">
        Search products
      </label>
      <input
        id="q"
        name="q"
        type="search"
        placeholder="Search"
        defaultValue={defaultValue}
        className="w-24 bg-transparent text-sm text-brand-white placeholder-blue-100 outline-none sm:w-36"
      />
      <button
        type="submit"
        aria-label="Search"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-white text-brand-navy"
      >
        <SearchIcon />
      </button>
    </form>
  );
}
