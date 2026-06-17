import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b">
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-700">
          📚 Study Verse India
        </Link>

        <nav className="hidden md:flex gap-6 font-medium text-gray-700">
          <Link href="/notifications">Notifications</Link>
          <Link href="/notes">Notes</Link>
          <Link href="/videos">Videos</Link>
          <Link href="/tests">Tests</Link>
          <Link href="/links">Links</Link>
        </nav>

        <Link
          href="/notes"
          className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold"
        >
          Start Learning
        </Link>
      </div>
    </header>
  );
}