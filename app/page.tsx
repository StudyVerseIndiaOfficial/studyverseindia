"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const mainSections = [
  {
    title: "Notes",
    subtitle: "Notes / PDFs",
    icon: "📚",
    href: "/notes",
    desc: "BPSC, Bihar Special, Railway, SSC और All Govt Exams के लिए premium notes और revision PDFs.",
    tag: "Study Material",
    color: "from-emerald-600 via-teal-600 to-cyan-600",
    keywords: "notes pdf study material bpsc bihar railway ssc revision",
  },
  {
    title: "Tests",
    subtitle: "Practice Tests",
    icon: "📝",
    href: "/tests",
    desc: "MCQ practice, mock test, instant result और exam-oriented self check preparation.",
    tag: "Practice",
    color: "from-orange-500 via-red-600 to-rose-700",
    keywords: "test tests mcq mock practice quiz result answer",
  },
  {
    title: "Videos",
    subtitle: "Video Classes",
    icon: "🎥",
    href: "/videos",
    desc: "Topic-wise video lectures, YouTube classes और important explanation videos.",
    tag: "Learning",
    color: "from-blue-700 via-indigo-700 to-violet-700",
    keywords: "videos youtube class lecture learning explanation",
  },
  {
    title: "Government News",
    subtitle: "Govt Updates",
    icon: "🏛️",
    href: "/government-news",
    desc: "सरकारी नौकरी, भर्ती, admit card, result, answer key और official notice updates.",
    tag: "Updates",
    color: "from-red-700 via-orange-600 to-yellow-500",
    keywords: "government news govt job vacancy admit card result answer key notice",
  },
  {
    title: "Important Links",
    subtitle: "Useful Links",
    icon: "🔗",
    href: "/links",
    desc: "Official websites, apply link, result link, syllabus link, social और useful resources.",
    tag: "Resources",
    color: "from-slate-900 via-gray-800 to-blue-900",
    keywords: "important links useful links official apply result syllabus website drive ppt social",
  },
];

const infoLinks = [
  { title: "About Us", href: "/about", icon: "ℹ️" },
  { title: "Contact Us", href: "/contact", icon: "📞" },
  { title: "Privacy Policy", href: "/privacy-policy", icon: "🔐" },
  { title: "Disclaimer", href: "/disclaimer", icon: "⚠️" },
  { title: "Terms & Conditions", href: "/terms", icon: "📄" },
];

const filters = ["All", "Notes", "Tests", "Videos", "Government", "Links"];

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);

  const filteredSections = useMemo(() => {
    const query = search.toLowerCase().trim();

    return mainSections.filter((item) => {
      const filterMatch =
        activeFilter === "All" ||
        item.title.toLowerCase().includes(activeFilter.toLowerCase()) ||
        item.keywords.toLowerCase().includes(activeFilter.toLowerCase());

      const searchMatch =
        query === "" ||
        item.title.toLowerCase().includes(query) ||
        item.subtitle.toLowerCase().includes(query) ||
        item.desc.toLowerCase().includes(query) ||
        item.keywords.toLowerCase().includes(query);

      return filterMatch && searchMatch;
    });
  }, [search, activeFilter]);

  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 pb-24 text-slate-950">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 px-4 pb-7 pt-5 text-white">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-yellow-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-lg font-black text-blue-950 shadow-xl">
                SV
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-xl font-black leading-tight md:text-3xl">
                  Study Verse India
                </h1>
                <p className="truncate text-xs font-bold text-cyan-100 md:text-sm">
                  Smart Study • Exam Updates • Premium Notes
                </p>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-black text-white shadow-lg backdrop-blur"
              >
                Menu ☰
              </button>

              {menuOpen && (
                <div className="absolute right-0 z-20 mt-3 w-64 overflow-hidden rounded-3xl border border-white/10 bg-white p-3 text-slate-950 shadow-2xl">
                  <p className="mb-2 px-2 text-xs font-black uppercase tracking-wide text-blue-700">
                    Information Pages
                  </p>

                  {infoLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-black text-slate-800 transition hover:bg-blue-50"
                    >
                      <span>{link.icon}</span>
                      <span>{link.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur md:p-8">
            <div className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black text-yellow-200">
              🚀 All Govt Exam Preparation Platform
            </div>

            <h2 className="text-4xl font-black leading-tight tracking-tight md:text-6xl">
              पढ़ाई को बनाइए
              <span className="block bg-gradient-to-r from-yellow-300 via-white to-cyan-200 bg-clip-text text-transparent">
                Smart, Fast & Premium
              </span>
            </h2>

            <p className="mt-4 max-w-3xl text-base font-bold leading-7 text-blue-50 md:text-lg">
              Notes, Tests, Videos, Government News और Important Links — सभी
              जरूरी study sections एक ही जगह।
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {mainSections.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black text-white backdrop-blur transition hover:bg-white hover:text-blue-950"
                >
                  {item.icon} {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-5 max-w-6xl px-4">
        <div className="rounded-[2rem] border border-slate-100 bg-white p-4 shadow-2xl md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <span className="text-xl">🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes, tests, videos, govt news, links..."
                className="w-full bg-transparent text-sm font-bold text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>

            <button
              onClick={() => {
                setSearch("");
                setActiveFilter("All");
              }}
              className="rounded-2xl bg-blue-950 px-5 py-3 text-sm font-black text-white shadow-lg"
            >
              Reset
            </button>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition ${
                  activeFilter === filter
                    ? "bg-blue-950 text-white shadow-lg"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-7">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-blue-700">
              Quick Access
            </p>
            <h2 className="text-2xl font-black text-slate-950 md:text-4xl">
              Choose Your Section
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-600">
              Notes — Tests — Videos — Government News — Important Links
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-black text-blue-800">
            {filteredSections.length} Sections
          </span>
        </div>

        {filteredSections.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-center shadow-lg">
            <p className="text-lg font-black text-slate-800">
              कोई section नहीं मिला
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              Search text बदलकर दुबारा try करें।
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSections.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group relative overflow-hidden rounded-[1.8rem] border border-slate-100 bg-white p-4 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-br ${card.color}`}
                />

                <div className="relative">
                  <div className="mb-8 flex items-start justify-between gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl shadow-xl">
                      {card.icon}
                    </div>

                    <span className="rounded-full bg-white/95 px-3 py-1 text-[10px] font-black text-slate-800 shadow">
                      {card.tag}
                    </span>
                  </div>

                  <div className="rounded-[1.4rem] bg-white p-4 shadow-sm">
                    <p className="text-xs font-black uppercase tracking-wide text-blue-700">
                      {card.subtitle}
                    </p>

                    <h3 className="mt-1 text-xl font-black text-slate-950">
                      {card.title}
                    </h3>

                    <p className="mt-2 min-h-[72px] text-sm font-semibold leading-6 text-slate-600">
                      {card.desc}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="rounded-full bg-blue-50 px-3 py-2 text-xs font-black text-blue-800">
                        Open Now
                      </span>

                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-white transition group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="rounded-[2rem] bg-gradient-to-br from-blue-950 to-indigo-900 p-5 text-white shadow-xl md:p-7">
          <p className="text-xs font-black uppercase tracking-wide text-cyan-200">
            Study Verse India
          </p>

          <h2 className="mt-2 text-2xl font-black md:text-4xl">
            Smart Preparation का सही तरीका
          </h2>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
              <p className="text-lg font-black text-yellow-200">01. Notes</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-blue-50">
                पहले topic को notes और PDFs से revise करें।
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
              <p className="text-lg font-black text-yellow-200">02. Videos</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-blue-50">
                कठिन topic को video से समझें।
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
              <p className="text-lg font-black text-yellow-200">03. Tests</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-blue-50">
                MCQ test देकर अपनी तैयारी check करें।
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}