export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-blue-100 shadow-[0_4px_20px_rgba(37,99,235,0.10)]">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <a href="/" className="flex items-center gap-3 min-w-0">
          <div className="w-13 h-13 min-w-13 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center shadow-lg">
            <span className="text-2xl">📚</span>
          </div>

          <div className="leading-tight min-w-0">
            <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-700 tracking-tight">
              Study Verse India
            </h1>

            <p className="text-[11px] md:text-sm font-bold text-gray-600 mt-1 line-clamp-1">
              All Govt Exam • BPSC • Bihar SI • BSSC • Railway • Banking • SSC
            </p>
          </div>
        </a>

        <a
          href="#student-dashboard"
          className="shrink-0 bg-gradient-to-r from-blue-600 to-purple-700 text-white px-4 md:px-6 py-3 rounded-2xl text-sm md:text-base font-black shadow-lg shadow-blue-200 hover:scale-105 transition"
        >
          Start
          <br />
          Learning
        </a>
      </div>
    </header>
  );
}