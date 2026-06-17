"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type NoteItem = {
  id: string;
  module: string;
  title: string;
  description: string;
  course: string;
  subject: string;
  chapter: string;
  topic: string;
  link: string;
  imageUrl: string;
  pdfUrl: string;
  youtubeUrl: string;
  date: string;
  isLive: boolean;
  published: boolean;
};

const getDefaultImage = (module: string) => {
  switch (module) {
    case "Government News":
      return "/images/government-news-default.png";

    case "Latest Information":
      return "/images/latest-info-default.png";

    case "Videos":
      return "/images/videos-default.png";

    case "Notes / PDF":
      return "/images/notes-default.png";

    case "Notes":
      return "/images/notes-default.png";

    case "Tests":
      return "/images/tests-default.png";

    case "Useful Links":
      return "/images/links-default.png";

    case "Notifications":
      return "/images/notifications-default.png";

    default:
      return "/images/notes-default.png";
  }
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

export default function NotesPage() {
  const [items, setItems] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<NoteItem | null>(null);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const snapshot = await getDocs(collection(db, "adminItems"));

        const data: NoteItem[] = snapshot.docs
          .map((docItem) => ({
            id: docItem.id,
            ...(docItem.data() as Omit<NoteItem, "id">),
          }))
          .filter(
            (item) =>
              (item.module === "Notes / PDF" || item.module === "Notes") &&
              item.published === true
          );

        setItems(data);
      } catch (error) {
        console.log(error);
        alert("Notes load नहीं हो पा रहा है।");
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 px-5 py-8">
      <section className="max-w-6xl mx-auto">
        <a href="/" className="inline-block mb-6 text-blue-600 font-semibold">
          ← Back to Home
        </a>

        <h1 className="text-4xl font-bold mb-2">📚 Notes / PDF</h1>

        <p className="text-gray-600 mb-8">
          Admin Dashboard से publish किए गए notes और PDF यहाँ live दिखेंगे।
        </p>

        {loading ? (
          <div className="bg-white rounded-3xl p-8 shadow text-center">
            Loading notes...
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 shadow text-center text-gray-500">
            अभी कोई published notes उपलब्ध नहीं है।
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition"
              >
                <img
                  src={item.imageUrl || getDefaultImage(item.module)}
                  alt={item.title}
                  className="w-full h-52 object-cover bg-gray-200"
                />

                <div className="p-5">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                      {item.course || "Notes / PDF"}
                    </span>

                    {item.isLive && (
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
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

                  <p className="text-xs text-gray-500 mb-4 break-words">
                    {item.subject || "Subject"} → {item.chapter || "Chapter"} →{" "}
                    {item.topic || "Topic"}
                  </p>

                  <button
                    onClick={() => setSelectedItem(item)}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl font-semibold"
                  >
                    Open Notes
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
              src={selectedItem.imageUrl || getDefaultImage(selectedItem.module)}
              alt={selectedItem.title}
              className="w-full h-64 object-cover bg-gray-200 rounded-t-3xl"
            />

            <div className="p-6">
              <div className="flex flex-wrap justify-between gap-3 mb-4">
                <div className="flex flex-wrap gap-2">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                    {selectedItem.course || "Notes / PDF"}
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

              <p className="text-sm text-gray-500 mb-3">
                📅 {selectedItem.date || "No date"}
              </p>

              <p className="text-sm text-gray-500 mb-5 break-words">
                {selectedItem.subject || "Subject"} →{" "}
                {selectedItem.chapter || "Chapter"} →{" "}
                {selectedItem.topic || "Topic"}
              </p>

              <div className="text-gray-700 leading-7 whitespace-pre-wrap break-words mb-6">
                {makeClickableText(selectedItem.description)}
              </div>

              <div className="flex flex-wrap gap-3">
                {selectedItem.pdfUrl && (
                  <a
                    href={selectedItem.pdfUrl}
                    target="_blank"
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold"
                  >
                    View PDF
                  </a>
                )}

                {selectedItem.pdfUrl && (
                  <a
                    href={selectedItem.pdfUrl}
                    target="_blank"
                    download
                    className="bg-green-600 text-white px-4 py-2 rounded-xl font-semibold"
                  >
                    Download PDF
                  </a>
                )}

                {selectedItem.link && (
                  <a
                    href={selectedItem.link}
                    target="_blank"
                    className="bg-purple-600 text-white px-4 py-2 rounded-xl font-semibold"
                  >
                    Open Link
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