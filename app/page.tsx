import AdBox from "@/components/AdBox";
const quickLinks = [
  {
    title: "Important Updates",
    icon: "📢",
    link: "/latest-info",
    color: "from-blue-600 to-indigo-700",
  },
  {
    title: "Notes",
    icon: "📚",
    link: "/notes",
    color: "from-emerald-600 to-green-700",
  },
  {
    title: "Videos",
    icon: "🎥",
    link: "/videos",
    color: "from-red-600 to-rose-700",
  },
  {
    title: "Tests",
    icon: "📝",
    link: "/tests",
    color: "from-purple-600 to-violet-700",
  },
  {
    title: "Alerts",
    icon: "🔔",
    link: "/notifications",
    color: "from-yellow-500 to-orange-600",
  },
];

const sections = [
  {
    title: "Notifications",
    description: "Latest alerts and important updates",
    link: "/notifications",
    image: "/images/notifications-default.png",
  },
  {
    title: "Latest Information",
    description: "Exam, result, admit card and study updates",
    link: "/latest-info",
    image: "/images/latest-info-default.png",
  },
  {
    title: "Government News",
    description: "Government schemes, vacancy and official news",
    link: "/government-news",
    image: "/images/government-news-default.png",
  },
  {
    title: "Videos",
    description: "Useful learning videos and classes",
    link: "/videos",
    image: "/images/videos-default.png",
  },
  {
    title: "Notes / PDF",
    description: "Class notes, PDF and study material",
    link: "/notes",
    image: "/images/notes-default.png",
  },
  {
    title: "Tests",
    description: "Live online tests and practice quizzes",
    link: "/tests",
    image: "/images/tests-default.png",
  },
  {
    title: "Important Links",
    description: "Official websites and useful exam links",
    link: "/links",
    image: "/images/links-default.png",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100 pb-24">
      <section className="bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 text-white px-5 py-12 md:py-16">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-5 tracking-tight">
            Study Verse India
          </h1>

          <p className="text-lg md:text-2xl leading-relaxed font-medium opacity-95 max-w-4xl mx-auto">
            All Govt Exam, BPSC, Bihar SI, BSSC, Railway, Banking, SSC और
            Defence Exam के लिए student friendly learning platform
          </p>
        </div>
      </section>

      <section
        id="student-dashboard"
        className="max-w-6xl mx-auto px-5 -mt-8 relative z-10"
      >
        <div className="bg-white rounded-[28px] shadow-2xl border border-gray-100 p-4 md:p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {quickLinks.map((item) => (
              <a
                key={item.title}
                href={item.link}
                className={`bg-gradient-to-br ${item.color} text-white rounded-3xl px-4 py-5 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition`}
              >
                <div className="text-3xl mb-3">{item.icon}</div>

                <h2 className="text-lg md:text-xl font-black leading-tight">
                  {item.title}
                </h2>

                <p className="text-sm opacity-90 mt-2 font-semibold">
                  Open Now →
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-5">
  <AdBox height="h-24" />
</section>

      <section className="max-w-6xl mx-auto px-5 py-10">
        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <a
              key={section.title}
              href={section.link}
              className="group bg-white rounded-[28px] shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition border border-gray-100"
            >
              <div className="relative">
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-52 object-cover bg-gray-200"
                />

                <div className="absolute top-4 right-4 bg-white/95 text-blue-700 px-4 py-2 rounded-full text-sm font-black shadow">
                  Open
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-black mb-3 text-gray-900 group-hover:text-blue-700 transition">
                  {section.title}
                </h3>

                <p className="text-gray-700 text-base leading-relaxed">
                  {section.description}
                </p>

                <div className="mt-5 inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-2xl font-bold shadow-md">
                  Open Section →
                </div>
              </div>
            </a>
            {index === 2 && (
                <div className="mt-7">
                  <AdBox height="h-24" />
                </div>
              )}
        </div>
      </section>
    </main>
  );
}