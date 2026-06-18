import Hero from "../components/Hero";
import FeatureCard from "../components/FeatureCard";
import SectionTitle from "../components/SectionTitle";

const cards = [
  {
    title: "Notifications",
    icon: "🔔",
    href: "/notifications",
    desc: "Exam alerts, notices and important updates",
  },
  {
    title: "Latest Information",
    icon: "📢",
    href: "/latest-info",
    desc: "Fresh educational and admission updates",
  },
  {
    title: "Government News",
    icon: "🏛",
    href: "/government-news",
    desc: "Bihar and central government updates",
  },
  {
    title: "Videos",
    icon: "🎥",
    href: "/videos",
    desc: "Class-wise video lectures",
  },
  {
    title: "Notes",
    icon: "📚",
    href: "/notes",
    desc: "PDF notes with view and download",
  },
  {
    title: "Tests",
    icon: "📝",
    href: "/tests",
    desc: "MCQ practice with instant result",
  },
  {
    title: "Useful Links",
    icon: "🔗",
    href: "/links",
    desc: "Drive, PPT, social and official links",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-8 pb-24">
      <section className="max-w-6xl mx-auto">
        <Hero />

        <div className="mt-10">
          <SectionTitle
            title="Quick Access"
            subtitle="Choose your learning section"
          /><section className="max-w-4xl mx-auto mb-10">
  <div className="bg-white rounded-2xl shadow-md p-4 flex gap-3">
    <input
      type="text"
      placeholder="Search notes, videos, tests..."
      className="w-full outline-none text-gray-700"
    />
    <button className="bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold">
      Search
    </button>
  </div>
</section>

<section className="mb-8">
  <h2 className="text-2xl font-bold mb-4">
    ⭐ Featured Learning
  </h2>

  <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-2xl shadow-md">
    <h3 className="text-xl font-bold mb-2">
      Bihar Special Notes + Tests
    </h3>
    <p className="text-gray-700 mb-4">
      BPSC और Bihar Exams के लिए important study material.
    </p>
    <a href="/notes" className="bg-orange-600 text-white px-4 py-2 rounded-lg">
      Start Now
    </a>
  </div>
</section>
        

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <FeatureCard
                key={card.href}
                title={card.title}
                icon={card.icon}
                href={card.href}
                desc={card.desc}
              />
            ))}
          </div>

          <div className="mt-10 text-center">
            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold text-gray-600">
              <a href="/about" className="hover:text-blue-700">
                About Us
              </a>

              <a href="/contact" className="hover:text-blue-700">
                Contact Us
              </a>

              <a href="/privacy-policy" className="hover:text-blue-700">
                Privacy Policy
              </a>

              <a href="/disclaimer" className="hover:text-blue-700">
                Disclaimer
              </a>

              <a href="/terms" className="hover:text-blue-700">
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}