import Link from "next/link";

const navLinks = [
  { name: "Notifications", href: "/notifications" },
  { name: "Notes", href: "/notes" },
  { name: "Videos", href: "/videos" },
  { name: "Tests", href: "/tests" },
  { name: "Links", href: "/links" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">📚</span>
          <span className="text-xl font-black text-blue-700">
            Study Verse India
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-700">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-blue-700 transition">
              {link.name}
            </Link>
          ))}
        </div>

        <Link
          href="/notes"
          className="hidden md:inline-block bg-blue-700 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-800 transition"
        >
          Start Learning
        </Link>
      </nav>
    </header>
  );
}