import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white mt-12">
      <div className="max-w-6xl mx-auto px-5 py-8 grid gap-6 md:grid-cols-3">
        <div>
          <h2 className="text-xl font-bold mb-2">📚 Study Verse India</h2>
          <p className="text-slate-300 text-sm">
            Students friendly learning platform for Notes, Tests, Videos and Updates.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Quick Links</h3>
          <div className="space-y-2 text-sm text-slate-300">
            <Link href="/notes" className="block">Notes</Link>
            <Link href="/videos" className="block">Videos</Link>
            <Link href="/tests" className="block">Tests</Link>
            <Link href="/notifications" className="block">Notifications</Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Focus Exams</h3>
          <p className="text-slate-300 text-sm">
            BPSC • Bihar Teacher • Banking • SSC • Bihar Board
          </p>
        </div>
      </div>

      <div className="border-t border-slate-700 text-center text-sm text-slate-400 py-4">
        © 2026 Study Verse India | Made for Students
      </div>
    </footer>
  );
}