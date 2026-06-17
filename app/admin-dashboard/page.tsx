"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

type AdminItem = {
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

const modules = [
  "Notifications",
  "Latest Information",
  "Government News",
  "Videos",
  "Notes / PDF",
  "Tests",
  "Useful Links",
];

const emptyForm: AdminItem = {
  id: "",
  module: "Notifications",
  title: "",
  description: "",
  course: "",
  subject: "",
  chapter: "",
  topic: "",
  link: "",
  imageUrl: "",
  pdfUrl: "",
  youtubeUrl: "",
  date: new Date().toISOString().split("T")[0],
  isLive: false,
  published: true,
};

const getDefaultThumbnail = (module: string) => {
  switch (module) {
    case "Notifications":
      return "/images/notification-default.jpg";
    case "Latest Information":
      return "/images/latest-info-default.jpg";
    case "Government News":
      return "/images/government-news-default.jpg";
    case "Notes / PDF":
      return "/images/notes-default.jpg";
    case "Videos":
      return "/images/videos-default.jpg";
    case "Tests":
      return "/images/tests-default.jpg";
    default:
      return "/images/default.jpg";
  }
};

export default function AdminDashboardPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [items, setItems] = useState<AdminItem[]>([]);
  const [form, setForm] = useState<AdminItem>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadItems = async () => {
    const snapshot = await getDocs(collection(db, "adminItems"));

    const data: AdminItem[] = snapshot.docs.map((docItem) => {
      const item = docItem.data() as Omit<AdminItem, "id">;

      return {
        id: docItem.id,
        ...item,
        date: item.date || new Date().toISOString().split("T")[0],
        isLive: item.isLive || false,
      };
    });

    setItems(data);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/admin");
        return;
      }

      await loadItems();
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveItem = async () => {
    if (!form.title.trim()) {
      alert("Title जरूरी है");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        module: form.module,
        title: form.title,
        description: form.description,
        course: form.course,
        subject: form.subject,
        chapter: form.chapter,
        topic: form.topic,
        link: form.link,
        imageUrl: form.imageUrl,
        pdfUrl: form.pdfUrl,
        youtubeUrl: form.youtubeUrl,
        date: form.date,
        isLive: form.isLive,
        published: form.published,
      };

      if (editingId) {
        await updateDoc(doc(db, "adminItems", editingId), payload);
        setEditingId(null);
      } else {
        await addDoc(collection(db, "adminItems"), payload);
      }

      setForm(emptyForm);
      await loadItems();
      alert("Saved Successfully");
    } catch (error) {
      console.log(error);
      alert("Save failed");
    } finally {
      setLoading(false);
    }
  };

  const editItem = (item: AdminItem) => {
    setForm(item);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteItem = async (id: string) => {
    const confirmDelete = confirm("क्या आप delete करना चाहते हैं?");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "adminItems", id));
    await loadItems();
  };

  const togglePublish = async (item: AdminItem) => {
    await updateDoc(doc(db, "adminItems", item.id), {
      published: !item.published,
    });

    await loadItems();
  };

  const logoutAdmin = async () => {
    await signOut(auth);
    router.push("/admin");
  };

  if (checkingAuth) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-lg font-semibold">Checking admin access...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="fixed bottom-5 right-5 z-50">
  <a
    href="/admin-dashboard/tests"
    className="block bg-purple-700 text-white px-6 py-4 rounded-full font-bold shadow-2xl hover:bg-purple-800 transition"
  >
    📝 Create Test
  </a>
</div>
      <section className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <a href="/" className="text-blue-700 font-semibold">
            ← Back to Home
          </a>

          <button
            onClick={logoutAdmin}
            className="bg-red-600 text-white px-5 py-3 rounded-xl font-semibold"
          >
            Logout
          </button>
        </div>

        <div className="bg-gradient-to-r from-blue-700 to-purple-700 text-white rounded-3xl p-8 mb-8 shadow-xl">
          <h1 className="text-4xl font-bold mb-3">Admin Dashboard</h1>
          <p>
            Content add, edit, delete, publish/unpublish, date और live tag manage करें।
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          <div className="bg-white rounded-3xl p-6 shadow-xl h-fit">
            <h2 className="text-2xl font-bold mb-5">
              {editingId ? "Edit Content" : "Add New Content"}
            </h2>

            <div className="space-y-4">
              <select
                name="module"
                value={form.module}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              >
                {modules.map((module) => (
                  <option key={module}>{module}</option>
                ))}
              </select>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Title *"
                className="w-full border rounded-xl px-4 py-3"
              />

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                rows={4}
                className="w-full border rounded-xl px-4 py-3"
              />

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3"
              />

              <label className="flex items-center gap-3 border rounded-xl px-4 py-3">
                <input
                  type="checkbox"
                  checked={form.isLive}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      isLive: e.target.checked,
                    }))
                  }
                />
                <span className="font-semibold">Show LIVE Tag</span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <input
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  placeholder="Course"
                  className="border rounded-xl px-4 py-3"
                />

                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  className="border rounded-xl px-4 py-3"
                />

                <input
                  name="chapter"
                  value={form.chapter}
                  onChange={handleChange}
                  placeholder="Chapter"
                  className="border rounded-xl px-4 py-3"
                />

                <input
                  name="topic"
                  value={form.topic}
                  onChange={handleChange}
                  placeholder="Topic"
                  className="border rounded-xl px-4 py-3"
                />
              </div>

              <input
                name="link"
                value={form.link}
                onChange={handleChange}
                placeholder="Official / external link"
                className="w-full border rounded-xl px-4 py-3"
              />

              <input
                name="pdfUrl"
                value={form.pdfUrl}
                onChange={handleChange}
                placeholder="PDF URL"
                className="w-full border rounded-xl px-4 py-3"
              />

              <input
                name="youtubeUrl"
                value={form.youtubeUrl}
                onChange={handleChange}
                placeholder="YouTube URL"
                className="w-full border rounded-xl px-4 py-3"
              />

              <button
                onClick={saveItem}
                disabled={loading}
                className="w-full bg-blue-700 text-white py-3 rounded-xl font-bold"
              >
                {loading ? "Saving..." : editingId ? "Update" : "Save"}
              </button>

              {editingId && (
                <button
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                  className="w-full bg-gray-200 py-3 rounded-xl font-bold"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-5">Content List</h2>

            {items.length === 0 ? (
              <p className="text-gray-500 text-center py-12">
                अभी कोई content add नहीं है।
              </p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="border rounded-2xl p-5">
                    <img
                      src={getDefaultThumbnail(item.module)}
                      alt={item.title}
                      className="w-full h-40 object-cover rounded-xl mb-4"
                    />

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                        {item.module}
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          item.published
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {item.published ? "Published" : "Draft"}
                      </span>

                      {item.isLive && (
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                          🔴 LIVE
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold break-words">{item.title}</h3>

                    <p className="text-sm text-gray-500 mt-1">
                      📅 {item.date}
                    </p>

                    <p className="text-gray-600 mt-2 break-words">
                      {item.description}
                    </p>

                    <p className="text-sm text-gray-500 mt-3">
                      {item.course || "Course"} → {item.subject || "Subject"} →{" "}
                      {item.chapter || "Chapter"} → {item.topic || "Topic"}
                    </p>

                    <div className="flex flex-wrap gap-3 mt-5">
                      <button
                        onClick={() => editItem(item)}
                        className="bg-slate-800 text-white px-4 py-2 rounded-xl"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => togglePublish(item)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-xl"
                      >
                        {item.published ? "Unpublish" : "Publish"}
                      </button>

                      <button
                        onClick={() => deleteItem(item.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-xl"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-5 text-sm text-yellow-900">
          <b>Note:</b> Thumbnail हर section के default image से आएगा। Images रखें:
          public/images/notification-default.jpg, latest-info-default.jpg,
          government-news-default.jpg, notes-default.jpg, videos-default.jpg,
          tests-default.jpg, default.jpg
        </div>
      </section>
    </main>
  );
}