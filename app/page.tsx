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
    <main className="min-h-screen bg-gray-100">
      <section className="bg-gradient-to-br from-blue-700 to-purple-800 text-white px-5 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Study Verse India
          </h1>

          <p className="text-lg md:text-xl opacity-90">
            All Govt Exam, BPSC, Bihar SI, BSSC, Railway, Banking, SSC और
            Defence Exam के लिए student friendly learning platform
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-10">
        <h2 className="text-3xl font-bold mb-8">
          Student Public Dashboard
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <a
              key={section.title}
              href={section.link}
              className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition"
            >
              <img
                src={section.image}
                alt={section.title}
                className="w-full h-48 object-cover bg-gray-200"
              />

              <div className="p-5">
                <h3 className="text-2xl font-bold mb-2">
                  {section.title}
                </h3>

                <p className="text-gray-600">
                  {section.description}
                </p>

                <div className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold">
                  Open
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}