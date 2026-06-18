"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type VideoItem = {
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
  published: boolean;
  date?: string;
};

function getYoutubeId(url: string) {
  if (!url) return "";

  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

  const match = url.match(regExp);

  return match && match[2].length === 11 ? match[2] : "";
}

export default function VideosPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadVideos = async () => {
    try {
      const snapshot = await getDocs(collection(db, "adminItems"));

      const data: VideoItem[] = snapshot.docs
        .map((docItem) => ({
          id: docItem.id,
          ...(docItem.data() as Omit<VideoItem, "id">),
        }))
        .filter((item) => item.module === "Videos" && item.published === true)
        .sort((a, b) => {
          const dateA = a.date ? new Date(a.date).getTime() : 0;
          const dateB = b.date ? new Date(b.date).getTime() : 0;
          return dateB - dateA;
        });

      setVideos(data);
    } catch (error) {
      console.log(error);
      alert("Videos load नहीं हो पा रहा है।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const filteredVideos = videos.filter((video) => {
    const searchText = searchQuery.toLowerCase();

    return (
      video.title?.toLowerCase().includes(searchText) ||
      video.description?.toLowerCase().includes(searchText) ||
      video.course?.toLowerCase().includes(searchText) ||
      video.subject?.toLowerCase().includes(searchText) ||
      video.chapter?.toLowerCase().includes(searchText) ||
      video.topic?.toLowerCase().includes(searchText)
    );
  });

  return (
    <main className="min-h-screen bg-gray-100 px-5 py-8">
      <section className="max-w-6xl mx-auto">
        <a href="/" className="inline-block mb-6 text-blue-600 font-semibold">
          ← Back to Home
        </a>

        <h1 className="text-4xl font-bold mb-2">🎥 Videos</h1>

        <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
          <input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full outline-none text-gray-700"
          />
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl p-8 shadow text-center">
            Loading videos...
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 shadow text-center text-gray-500">
            अभी कोई published video उपलब्ध नहीं है।
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVideos.map((video) => {
              const youtubeId = getYoutubeId(video.youtubeUrl || video.link);
              const thumbnail =
                video.imageUrl ||
                (youtubeId
                  ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
                  : "");

              return (
                <div
                  key={video.id}
                  className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition"
                >
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={video.title}
                      className="w-full h-44 object-cover bg-gray-200"
                    />
                  ) : (
                    <div className="w-full h-44 bg-gradient-to-r from-red-600 to-purple-600 flex items-center justify-center text-white text-4xl">
                      🎥
                    </div>
                  )}

                  <div className="p-5">
                    <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold mb-3">
                      {video.course || "Video Lecture"}
                    </span>

                    <h2 className="text-xl font-bold mb-2">{video.title}</h2>

                    <p className="text-gray-600 text-sm mb-4">
                      {video.description}
                    </p>

                    <p className="text-xs text-gray-500 mb-4">
                      {video.subject || "Subject"} →{" "}
                      {video.chapter || "Chapter"} → {video.topic || "Topic"}
                    </p>

                    <a
                      href={video.youtubeUrl || video.link || "#"}
                      target="_blank"
                      className="inline-block bg-red-600 text-white px-4 py-2 rounded-xl font-semibold"
                    >
                      Watch Video
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}