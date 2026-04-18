import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200/70 bg-white/95 backdrop-blur transition-colors duration-200 dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-zinc-950 dark:text-white">
          MyProject
        </Link>
        <nav className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-300">
          <Link href="/" className="hover:text-zinc-950 dark:hover:text-white">
            Home
          </Link>
          <Link href="/about" className="hover:text-zinc-950 dark:hover:text-white">
            About
          </Link>
          <Link href="/contact" className="hover:text-zinc-950 dark:hover:text-white">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
