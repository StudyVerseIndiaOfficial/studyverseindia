import Link from "next/link";

export default function Hero() {
  return (
    <section className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white p-8 md:p-12 shadow-2xl">
      <p className="text-sm font-semibold bg-white/20 inline-block px-4 py-2 rounded-full mb-5">
        Bihar Students Friendly Platform
      </p>

      <h1 className="text-4xl md:text-6xl font-black leading-tight">
        Study Verse India
      </h1>

      <p className="mt-4 text-lg text-blue-100 max-w-2xl">
        BPSC • Bihar Teacher • Banking • SSC • Bihar Board
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/notes"
          className="bg-white text-blue-700 px-6 py-3 rounded-xl font-bold shadow hover:scale-105 transition"
        >
          📚 Explore Notes
        </Link>

        <Link
          href="/tests"
          className="bg-yellow-400 text-slate-900 px-6 py-3 rounded-xl font-bold shadow hover:scale-105 transition"
        >
          📝 Start Test
        </Link>
      </div>
    </section>
  );
}