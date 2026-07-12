"use client";

import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";

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

type FormState = {
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
  "Useful Links",
];

const todayDate = new Date().toISOString().slice(0, 10);

const emptyForm: FormState = {
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
  date: todayDate,
  isLive: false,
  published: true,
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
    case "Tests":
      return "/images/tests-default.png";
    case "Useful Links":
      return "/images/links-default.png";
    case "Notifications":
      return "/images/notifications-default.png";
    default:
      return "/images/notifications-default.png";
  }
};

export default function AdminDashboardPage() {
  const router = useRouter();

  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [items, setItems] = useState<AdminItem[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const inputClass =
    "w-full border border-gray-300 rounded-2xl px-4 py-4 text-base outline-none focus:ring-2 focus:ring-blue-500 bg-white";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/admin");
        setAuthLoading(false);
        return;
      }

      setAdminUser(user);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const loadItems = async () => {
    try {
      const snapshot = await getDocs(collection(db, "adminItems"));

      const data: AdminItem[] = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...(docItem.data() as Omit<AdminItem, "id">),
      }));

      setItems(data.reverse());
    } catch (error) {
      console.log(error);
      alert("Content list load नहीं हो पा रही है।");
    }
  };

  useEffect(() => {
    if (adminUser) {
      loadItems();
    }
  }, [adminUser]);

  const updateForm = (field: keyof FormState, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      ...emptyForm,
      module: form.module,
      date: todayDate,
    });
    setEditingId(null);
  };

  const saveContent = async () => {
    if (!form.title.trim()) {
      alert("Title भरें");
      return;
    }

    if (!form.description.trim()) {
      alert("Description भरें");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        module: form.module,
        title: form.title.trim(),
        description: form.description.trim(),
        course: form.course.trim(),
        subject: form.subject.trim(),
        chapter: form.chapter.trim(),
        topic: form.topic.trim(),
        link: form.link.trim(),
        imageUrl: form.imageUrl.trim(),
        pdfUrl: form.pdfUrl.trim(),
        youtubeUrl: form.youtubeUrl.trim(),
        date: form.date,
        isLive: form.isLive,
        published: form.published,
        defaultImage: getDefaultImage(form.module),
        updatedAt: new Date().toISOString(),
      };

      if (editingId) {
        await updateDoc(doc(db, "adminItems", editingId), payload);
        alert("Content updated successfully!");
      } else {
        await addDoc(collection(db, "adminItems"), {
          ...payload,
          createdAt: new Date().toISOString(),
        });
        alert("Content saved successfully!");
      }

      resetForm();
      await loadItems();
    } catch (error) {
      console.log(error);
      alert("Save नहीं हो पाया। Internet/Firebase check करें।");
    } finally {
      setSaving(false);
    }
  };

  const editItem = (item: AdminItem) => {
    setEditingId(item.id);

    setForm({
      module: item.module || "Notifications",
      title: item.title || "",
      description: item.description || "",
      course: item.course || "",
      subject: item.subject || "",
      chapter: item.chapter || "",
      topic: item.topic || "",
      link: item.link || "",
      imageUrl: item.imageUrl || "",
      pdfUrl: item.pdfUrl || "",
      youtubeUrl: item.youtubeUrl || "",
      date: item.date || todayDate,
      isLive: item.isLive || false,
      published: item.published ?? true,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const togglePublish = async (item: AdminItem) => {
    try {
      await updateDoc(doc(db, "adminItems", item.id), {
        published: !item.published,
        updatedAt: new Date().toISOString(),
      });

      await loadItems();
    } catch (error) {
      console.log(error);
      alert("Publish status change नहीं हो पाया।");
    }
  };

  const deleteItem = async (id: string) => {
    const confirmDelete = confirm("क्या आप इस content को delete करना चाहते हैं?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "adminItems", id));
      alert("Deleted successfully");
      await loadItems();
    } catch (error) {
      console.log(error);
      alert("Delete नहीं हो पाया।");
    }
  };

  const logoutAdmin = async () => {
    await signOut(auth);
    router.push("/admin");
  };

  if (authLoading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center px-5">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          Loading admin dashboard...
        </div>
      </main>
    );
  }

  if (!adminUser) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 md:px-8 py-6 pb-28 overflow-x-hidden">
      <a
        href="/admin-dashboard/tests"
        className="fixed right-4 bottom-5 z-50 bg-purple-700 text-white px-5 py-4 rounded-full font-black shadow-2xl hover:bg-purple-800 transition text-sm md:text-base"
      >
        📝 Create Test
      </a>

      <section className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
         

          <div className="flex flex-wrap gap-2">
  <a
    href="/admin-dashboard/tests"
    className="bg-purple-700 text-white px-4 py-3 rounded-2xl font-bold shadow"
  >
    🧪 Test Creator
  </a>

  <a
    href="/admin/pdf-maker"
    className="inline-flex items-center justify-center rounded-2xl bg-red-900 px-5 py-3 text-sm font-black text-white shadow-lg transition hover:bg-red-800"
  >
    Smart PDF Maker
  </a>

  <button
    onClick={logoutAdmin}
    className="bg-red-600 text-white px-4 py-3 rounded-2xl font-bold shadow"
  >
    Logout
  </button>
</div>
        </div>
     

        <div className="bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 text-white rounded-[32px] shadow-2xl p-8 md:p-12 mb-8">
          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
            Admin Dashboard
          </h1>

          <p className="text-lg md:text-2xl leading-relaxed opacity-95">
            Content add, edit, delete, publish/unpublish, date और live tag manage करें।
          </p>
        </div>

        <div className="bg-white rounded-[32px] shadow-xl p-5 md:p-8 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              {editingId ? "Edit Content" : "Add New Content"}
            </h2>

            {editingId && (
              <button
                onClick={resetForm}
                className="bg-gray-200 text-gray-900 px-4 py-3 rounded-2xl font-bold"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block font-bold text-gray-700 mb-2">
                Section
              </label>
              <select
                value={form.module}
                onChange={(e) => updateForm("module", e.target.value)}
                className={inputClass}
              >
                {modules.map((module) => (
                  <option key={module} value={module}>
                    {module}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateForm("title", e.target.value)}
                placeholder="Title लिखें"
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={form.description}
                onChange={(e) => updateForm("description", e.target.value)}
                placeholder="Full description लिखें"
                rows={6}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => updateForm("date", e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="flex items-center gap-3 border border-gray-300 rounded-2xl px-4 py-4 bg-white">
              <input
                type="checkbox"
                checked={form.isLive}
                onChange={(e) => updateForm("isLive", e.target.checked)}
                className="w-5 h-5"
              />
              <span className="font-bold text-gray-800">Show LIVE Tag</span>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-2">
                Course
              </label>
              <input
                type="text"
                value={form.course}
                onChange={(e) => updateForm("course", e.target.value)}
                placeholder="BPSC / SSC / Banking"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => updateForm("subject", e.target.value)}
                placeholder="History / English / Bihar Special"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-2">
                Chapter
              </label>
              <input
                type="text"
                value={form.chapter}
                onChange={(e) => updateForm("chapter", e.target.value)}
                placeholder="Chapter"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-2">
                Topic
              </label>
              <input
                type="text"
                value={form.topic}
                onChange={(e) => updateForm("topic", e.target.value)}
                placeholder="Topic"
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-gray-700 mb-2">
                Official / External Link
              </label>
              <input
                type="text"
                value={form.link}
                onChange={(e) => updateForm("link", e.target.value)}
                placeholder="https://example.com"
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-gray-700 mb-2">
                Image URL Optional
              </label>
              <input
                type="text"
                value={form.imageUrl}
                onChange={(e) => updateForm("imageUrl", e.target.value)}
                placeholder="खाली छोड़ेंगे तो default thumbnail लगेगा"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-2">
                PDF URL
              </label>
              <input
                type="text"
                value={form.pdfUrl}
                onChange={(e) => updateForm("pdfUrl", e.target.value)}
                placeholder="/pdfs/file.pdf"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-2">
                YouTube URL
              </label>
              <input
                type="text"
                value={form.youtubeUrl}
                onChange={(e) => updateForm("youtubeUrl", e.target.value)}
                placeholder="YouTube video link"
                className={inputClass}
              />
            </div>

            <div className="flex items-center gap-3 border border-gray-300 rounded-2xl px-4 py-4 bg-white">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => updateForm("published", e.target.checked)}
                className="w-5 h-5"
              />
              <span className="font-bold text-gray-800">Published</span>
            </div>
          </div>

          <button
            onClick={saveContent}
            disabled={saving}
            className="w-full mt-6 bg-blue-700 text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-blue-800 transition disabled:opacity-60"
          >
            {saving ? "Saving..." : editingId ? "Update Content" : "Save / Publish Content"}
          </button>
        </div>

        <div className="bg-white rounded-[32px] shadow-xl p-5 md:p-8">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-6">
            Content List
          </h2>

          {items.length === 0 ? (
            <div className="bg-gray-50 rounded-3xl p-8 text-center text-gray-600">
              अभी कोई content saved नहीं है।
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {items.map((item) => {
                const thumbnail = item.imageUrl?.trim() || getDefaultImage(item.module);

                return (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-3xl overflow-hidden bg-white shadow-sm"
                  >
                    <img
                      src={thumbnail}
                      alt={item.title}
                      className="w-full h-44 object-cover bg-gray-200"
                    />

                    <div className="p-5">
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-black">
                          {item.module}
                        </span>

                        {item.published ? (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black">
                            Published
                          </span>
                        ) : (
                          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-black">
                            Draft
                          </span>
                        )}

                        {item.isLive && (
                          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-black">
                            LIVE
                          </span>
                        )}
                      </div>

                      <h3 className="text-2xl font-black text-gray-900 break-words mb-2">
                        {item.title}
                      </h3>

                      <p className="text-sm text-gray-500 mb-3">
                        📅 {item.date || "No date"}
                      </p>

                      <p className="text-gray-700 text-sm leading-relaxed break-words mb-4">
                        {item.description}
                      </p>

                      <p className="text-xs text-gray-500 break-words mb-4">
                        {item.course || "Course"} → {item.subject || "Subject"} →{" "}
                        {item.chapter || "Chapter"} → {item.topic || "Topic"}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => editItem(item)}
                          className="bg-gray-900 text-white px-4 py-3 rounded-xl font-bold"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => togglePublish(item)}
                          className="bg-purple-700 text-white px-4 py-3 rounded-xl font-bold"
                        >
                          {item.published ? "Unpublish" : "Publish"}
                        </button>

                        <button
                          onClick={() => deleteItem(item.id)}
                          className="bg-red-600 text-white px-4 py-3 rounded-xl font-bold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}