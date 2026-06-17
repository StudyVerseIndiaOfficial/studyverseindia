import Link from "next/link";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg md:hidden z-50">
      <div className="grid grid-cols-5 text-xs text-center">
        <Link href="/" className="py-3">🏠<br />Home</Link>
        <Link href="/notes" className="py-3">📚<br />Notes</Link>
        <Link href="/videos" className="py-3">🎥<br />Videos</Link>
        <Link href="/tests" className="py-3">📝<br />Tests</Link>
        <Link href="/notifications" className="py-3">🔔<br />Alerts</Link>
      </div>
    </nav>
  );
}