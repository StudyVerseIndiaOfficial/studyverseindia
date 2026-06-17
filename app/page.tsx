import { Fragment } from "react";

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

function AdBox() {
  return (
    <div className="md:col-span-2 lg:col-span-3 bg-white border-2 border-dashed border-gray-300 rounded-3xl p-6 text-center shadow-sm">
      <p className="text-sm font-bold text-gray-500 uppercase tracking-wide">
        Advertisement
      </p>
      <p className="text-xs text-gray-400 mt-1">
        Google Ads will appear here after approval
      </p>
    </div>
  );
}

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
        className="max-w-6xl mx-auto px-5 py-10"
      >
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">
            Student Public Dashboard
          </h2>

          <p className="text-gray-700 mt-2 text-base md:text-lg">
            Notes, videos, tests, alerts और important updates एक जगह।
          </p>
        </div>

        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section, index) => (
            <Fragment key={section.title}>
              <a
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

              {index === 2 && <AdBox />}
            </Fragment>
          ))}
        </div>
      </section>
    </main>
  );
}