"use client";
import { searchAndSortItems } from "@/lib/searchContent";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type GovernmentNewsItem = {
  id: string;
  module: string;
  title: string;
  description: string;
  course: string;
  subject: string;
  chapter: string;
  topic: string;
  link: string;
  pdfUrl: string;
  youtubeUrl: string;
  date: string;
  isLive: boolean;
  published: boolean;
};

function makeClickableText(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  return text.split(urlRegex).map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          className="text-blue-600 underline break-words"
        >
          {part}
        </a>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

export default function GovernmentNewsPage() {
  const [items, setItems] = useState<GovernmentNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedItem, setSelectedItem] = useState<GovernmentNewsItem | null>(
    null
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const snapshot = await getDocs(collection(db, "adminItems"));

        const data: GovernmentNewsItem[] = snapshot.docs
          .map((docItem) => ({
            id: docItem.id,
            ...(docItem.data() as Omit<GovernmentNewsItem, "id">),
          }))
          .filter(
            (item) =>
              item.module === "Government News" && item.published === true
          );

        setItems(data);
      } catch (error) {
        console.log(error);
        alert("Government News load नहीं हो पा रहा है।");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 px-5 py-8">
      <section className="max-w-6xl mx-auto">
        <a href="/" className="inline-block mb-6 text-blue-600 font-semibold">
          ← Back to Home
        </a>

        <h1 className="text-4xl font-bold mb-2">🏛 Government News</h1>

        {loading ? (
          <div className="bg-white rounded-3xl p-8 shadow text-center">
            Loading government news...
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 shadow text-center text-gray-500">
            अभी कोई published government news उपलब्ध नहीं है।
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition"
              >
                <img
                  src="/images/government-news-default.png"
                  alt={item.title}
                  className="w-full h-52 object-cover"
                />

                <div className="p-5">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                      {item.course || "Government News"}
                    </span>

                    {item.isLive && (
                      <span className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                        🔴 LIVE
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-bold mb-2 break-words">
                    {item.title}
                  </h2>

                  <p className="text-sm text-gray-500 mb-3">
                    📅 {item.date || "No date"}
                  </p>

                  <p className="text-gray-600 text-sm mb-4 break-words line-clamp-3">
                    {item.description}
                  </p>

                  <button
                    onClick={() => setSelectedItem(item)}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl font-semibold"
                  >
                    Read Full News
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <img
              src="/images/government-news-default.png"
              alt={selectedItem.title}
              className="w-full h-64 object-cover rounded-t-3xl"
            />

            <div className="p-6">
              <div className="flex flex-wrap justify-between gap-3 mb-4">
                <div className="flex flex-wrap gap-2">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                    {selectedItem.course || "Government News"}
                  </span>

                  {selectedItem.isLive && (
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                      🔴 LIVE
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setSelectedItem(null)}
                  className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold"
                >
                  ✕ Close
                </button>
              </div>

              <h2 className="text-3xl font-bold mb-3 break-words">
                {selectedItem.title}
              </h2>

              <p className="text-sm text-gray-500 mb-5">
                📅 {selectedItem.date || "No date"}
              </p>

              <div className="text-gray-700 leading-7 whitespace-pre-wrap break-words mb-6">
                {makeClickableText(selectedItem.description)}
              </div>

              <div className="flex flex-wrap gap-3">
                {selectedItem.link && (
                  <a
                    href={selectedItem.link}
                    target="_blank"
                    className="bg-green-600 text-white px-4 py-2 rounded-xl font-semibold"
                  >
                    Open Official Link
                  </a>
                )}

                {selectedItem.pdfUrl && (
                  <a
                    href={selectedItem.pdfUrl}
                    target="_blank"
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold"
                  >
                    Open PDF
                  </a>
                )}

                {selectedItem.youtubeUrl && (
                  <a
                    href={selectedItem.youtubeUrl}
                    target="_blank"
                    className="bg-red-600 text-white px-4 py-2 rounded-xl font-semibold"
                  >
                    Watch Video
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}