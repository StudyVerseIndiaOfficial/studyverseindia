"use client";

import { useEffect, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";

type Question = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

export default function AdminTestCreatorPage() {
  const router = useRouter();

  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState("");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("10");
  const [isLive, setIsLive] = useState(false);
  const [published, setPublished] = useState(true);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [bulkText, setBulkText] = useState("");

  const [manualQuestion, setManualQuestion] = useState("");
  const [manualOptionA, setManualOptionA] = useState("");
  const [manualOptionB, setManualOptionB] = useState("");
  const [manualOptionC, setManualOptionC] = useState("");
  const [manualOptionD, setManualOptionD] = useState("");
  const [manualCorrectIndex, setManualCorrectIndex] = useState("0");
  const [manualExplanation, setManualExplanation] = useState("");

  const inputClass =
    "w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 bg-white";

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

  const addManualQuestion = () => {
    const options = [
      manualOptionA.trim(),
      manualOptionB.trim(),
      manualOptionC.trim(),
      manualOptionD.trim(),
    ];

    if (!manualQuestion.trim()) {
      alert("Question लिखें");
      return;
    }

    if (options.some((option) => !option)) {
      alert("चारों options भरें");
      return;
    }

    const correctAnswer = options[Number(manualCorrectIndex)];

    const newQuestion: Question = {
      question: manualQuestion.trim(),
      options,
      answer: correctAnswer,
      explanation:
        manualExplanation.trim() || "Explanation अभी add नहीं किया गया है।",
    };

    setQuestions((prev) => [...prev, newQuestion]);

    setManualQuestion("");
    setManualOptionA("");
    setManualOptionB("");
    setManualOptionC("");
    setManualOptionD("");
    setManualCorrectIndex("0");
    setManualExplanation("");
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const parseBulkQuestions = (text: string): Question[] => {
    const lines = text
      .replace(/\r/g, "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const parsedQuestions: Question[] = [];

    let currentQuestion = "";
    let options = ["", "", "", ""];
    let answerRaw = "";
    let explanation = "";

    const pushQuestion = () => {
      if (!currentQuestion || options.some((option) => !option) || !answerRaw) {
        return;
      }

      const answerLetter = answerRaw.trim().match(/^[ABCD]/i);
      let finalAnswer = answerRaw.trim();

      if (answerLetter) {
        const index = answerLetter[0].toUpperCase().charCodeAt(0) - 65;
        finalAnswer = options[index] || finalAnswer;
      }

      parsedQuestions.push({
        question: currentQuestion.trim(),
        options: options.map((option) => option.trim()),
        answer: finalAnswer.trim(),
        explanation:
          explanation.trim() || "Explanation अभी add नहीं किया गया है।",
      });
    };

    lines.forEach((line) => {
      const questionMatch = line.match(
        /^(Q\s*\d+[\.\)\:\-]?|\d+[\.\)\:\-])\s*(.*)/i
      );

      const questionTextMatch = line.match(/^Question\s*[:\-]\s*(.*)/i);
      const optionAMatch = line.match(/^A[\.\)\:\-]\s*(.*)/i);
      const optionBMatch = line.match(/^B[\.\)\:\-]\s*(.*)/i);
      const optionCMatch = line.match(/^C[\.\)\:\-]\s*(.*)/i);
      const optionDMatch = line.match(/^D[\.\)\:\-]\s*(.*)/i);
      const answerMatch = line.match(
        /^(Answer|Ans|Correct Answer|उत्तर)\s*[:\-]\s*(.*)/i
      );
      const explanationMatch = line.match(
        /^(Explanation|Explain|Solution|व्याख्या)\s*[:\-]\s*(.*)/i
      );

      if (questionMatch || questionTextMatch) {
        pushQuestion();

        currentQuestion =
          questionMatch?.[2]?.trim() || questionTextMatch?.[1]?.trim() || "";

        options = ["", "", "", ""];
        answerRaw = "";
        explanation = "";
        return;
      }

      if (optionAMatch) {
        options[0] = optionAMatch[1].trim();
        return;
      }

      if (optionBMatch) {
        options[1] = optionBMatch[1].trim();
        return;
      }

      if (optionCMatch) {
        options[2] = optionCMatch[1].trim();
        return;
      }

      if (optionDMatch) {
        options[3] = optionDMatch[1].trim();
        return;
      }

      if (answerMatch) {
        answerRaw = answerMatch[2].trim();
        return;
      }

      if (explanationMatch) {
        explanation = explanationMatch[2].trim();
        return;
      }

      if (explanation) {
        explanation += " " + line;
      }
    });

    pushQuestion();

    return parsedQuestions;
  };

  const convertBulkQuestions = () => {
    if (!bulkText.trim()) {
      alert("Bulk questions paste करें");
      return;
    }

    const parsed = parseBulkQuestions(bulkText);

    if (parsed.length === 0) {
      alert(
        "Question convert नहीं हुआ। Format ऐसा रखें: Q1, A, B, C, D, Answer, Explanation"
      );
      return;
    }

    setQuestions(parsed);
    alert(`${parsed.length} questions convert हो गए। नीचे preview check करें।`);
  };

  const saveTest = async () => {
    if (!title.trim()) {
      alert("Test title भरें");
      return;
    }

    if (!description.trim()) {
      alert("Description भरें");
      return;
    }

    if (questions.length === 0) {
      alert("Test publish करने से पहले questions add करें");
      return;
    }

    try {
      setSaving(true);

      await addDoc(collection(db, "adminItems"), {
        module: "Tests",
        title: title.trim(),
        description: description.trim(),
        course: course.trim(),
        subject: subject.trim(),
        chapter: chapter.trim(),
        topic: topic.trim(),
        link: "",
        imageUrl: "",
        pdfUrl: "",
        youtubeUrl: "",
        date: date.trim(),
        isLive,
        published,
        durationMinutes: Number(durationMinutes) || 10,
        questions,
        defaultImage: "/images/tests-default.png",
        createdAt: new Date().toISOString(),
      });

      alert("Test successfully saved / published!");

      setTitle("");
      setDescription("");
      setCourse("");
      setSubject("");
      setChapter("");
      setTopic("");
      setDate("");
      setDurationMinutes("10");
      setIsLive(false);
      setPublished(true);
      setQuestions([]);
      setBulkText("");
    } catch (error) {
      console.log(error);
      alert("Test save नहीं हो पाया। Firebase/Internet check करें।");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-3xl shadow text-center">
          Loading test creator...
        </div>
      </main>
    );
  }

  if (!adminUser) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-100 px-5 py-8">
      <section className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold">📝 Admin Test Creator</h1>
            <p className="text-gray-600">
              यहाँ से नया test create करके public Tests page पर live publish करें।
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/admin-dashboard"
              className="bg-gray-800 text-white px-5 py-3 rounded-xl font-semibold"
            >
              Back to Admin Dashboard
            </a>

            <a
              href="/tests"
              target="_blank"
              className="bg-purple-700 text-white px-5 py-3 rounded-xl font-semibold"
            >
              View Public Tests
            </a>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-6">Test Details</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block font-semibold mb-2">Test Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="All Subject Mix Test - 01"
                  className={inputClass}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Test description लिखें"
                  rows={4}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Course</label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  placeholder="All Govt Exam / BPSC / SSC"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="English History Math Science Mix"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Chapter</label>
                <input
                  type="text"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                  placeholder="Mixed Practice"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="20 Questions"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Duration Minutes
                </label>
                <input
                  type="number"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
                <input
                  type="checkbox"
                  checked={isLive}
                  onChange={(e) => setIsLive(e.target.checked)}
                  className="w-5 h-5"
                />
                <span className="font-semibold">Show LIVE Tag</span>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-5 h-5"
                />
                <span className="font-semibold">Published</span>
              </div>
            </div>

            <div className="mt-8 border-t pt-8">
              <h2 className="text-3xl font-bold mb-2">Question Add System</h2>

              <p className="text-gray-600 mb-6">
                Manual question add कर सकते हैं या ChatGPT / NotebookLM / Gemini
                से बने MCQ bulk paste करके convert कर सकते हैं।
              </p>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="bg-blue-50 rounded-3xl p-5">
                  <h3 className="text-xl font-bold mb-4">
                    Method 1: Manual Question Add
                  </h3>

                  <div className="space-y-4">
                    <textarea
                      value={manualQuestion}
                      onChange={(e) => setManualQuestion(e.target.value)}
                      placeholder="Question लिखें"
                      rows={3}
                      className={inputClass}
                    />

                    <input
                      type="text"
                      value={manualOptionA}
                      onChange={(e) => setManualOptionA(e.target.value)}
                      placeholder="Option A"
                      className={inputClass}
                    />

                    <input
                      type="text"
                      value={manualOptionB}
                      onChange={(e) => setManualOptionB(e.target.value)}
                      placeholder="Option B"
                      className={inputClass}
                    />

                    <input
                      type="text"
                      value={manualOptionC}
                      onChange={(e) => setManualOptionC(e.target.value)}
                      placeholder="Option C"
                      className={inputClass}
                    />

                    <input
                      type="text"
                      value={manualOptionD}
                      onChange={(e) => setManualOptionD(e.target.value)}
                      placeholder="Option D"
                      className={inputClass}
                    />

                    <select
                      value={manualCorrectIndex}
                      onChange={(e) => setManualCorrectIndex(e.target.value)}
                      className={inputClass}
                    >
                      <option value="0">Correct Answer: A</option>
                      <option value="1">Correct Answer: B</option>
                      <option value="2">Correct Answer: C</option>
                      <option value="3">Correct Answer: D</option>
                    </select>

                    <textarea
                      value={manualExplanation}
                      onChange={(e) => setManualExplanation(e.target.value)}
                      placeholder="Explanation लिखें"
                      rows={3}
                      className={inputClass}
                    />

                    <button
                      onClick={addManualQuestion}
                      className="w-full bg-blue-700 text-white py-3 rounded-xl font-bold"
                    >
                      + Add Question
                    </button>
                  </div>
                </div>

                <div className="bg-green-50 rounded-3xl p-5">
                  <h3 className="text-xl font-bold mb-4">
                    Method 2: Bulk Paste Converter
                  </h3>

                  <textarea
                    value={bulkText}
                    onChange={(e) => setBulkText(e.target.value)}
                    placeholder={`Q1. बिहार की राजधानी क्या है?
A. गया
B. पटना
C. मुजफ्फरपुर
D. भागलपुर
Answer: B
Explanation: बिहार की राजधानी पटना है।

Q2. Choose the synonym of Brave.
A. Coward
B. Fearless
C. Weak
D. Lazy
Answer: B
Explanation: Brave का अर्थ Fearless होता है।`}
                    rows={18}
                    className={inputClass}
                  />

                  <button
                    onClick={convertBulkQuestions}
                    className="w-full mt-4 bg-green-700 text-white py-3 rounded-xl font-bold"
                  >
                    Convert Questions
                  </button>

                  <p className="text-sm text-gray-600 mt-3">
                    Convert करने के बाद नीचे preview में questions दिखेंगे।
                  </p>
                </div>
              </div>

              <div className="mt-8 bg-white border rounded-3xl p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <h3 className="text-2xl font-bold">
                    Question Preview: {questions.length}
                  </h3>

                  {questions.length > 0 && (
                    <button
                      onClick={() => setQuestions([])}
                      className="bg-red-100 text-red-700 px-4 py-2 rounded-xl font-semibold"
                    >
                      Clear All Questions
                    </button>
                  )}
                </div>

                {questions.length === 0 ? (
                  <div className="text-gray-500 bg-gray-50 rounded-2xl p-5 text-center">
                    अभी कोई question add नहीं है।
                  </div>
                ) : (
                  <div className="space-y-4">
                    {questions.map((q, index) => (
                      <div
                        key={`${q.question}-${index}`}
                        className="border rounded-2xl p-4"
                      >
                        <div className="flex justify-between gap-3">
                          <h4 className="font-bold break-words">
                            Q{index + 1}. {q.question}
                          </h4>

                          <button
                            onClick={() => removeQuestion(index)}
                            className="text-red-600 font-bold"
                          >
                            Delete
                          </button>
                        </div>

                        <div className="grid gap-2 md:grid-cols-2 mt-3 text-sm">
                          {q.options.map((option, optionIndex) => (
                            <div
                              key={`${option}-${optionIndex}`}
                              className={`p-3 rounded-xl border ${
                                q.answer === option
                                  ? "bg-green-100 border-green-500"
                                  : "bg-gray-50"
                              }`}
                            >
                              {String.fromCharCode(65 + optionIndex)}. {option}
                            </div>
                          ))}
                        </div>

                        <p className="mt-3 text-sm text-green-700 font-semibold">
                          Correct Answer: {q.answer}
                        </p>

                        <p className="mt-2 text-sm text-gray-600 break-words">
                          Explanation: {q.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={saveTest}
                disabled={saving}
                className="w-full mt-8 bg-purple-700 text-white py-4 rounded-2xl font-bold hover:bg-purple-800 transition"
              >
                {saving ? "Saving Test..." : "Save / Publish Test"}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6 h-fit">
            <h2 className="text-2xl font-bold mb-4">Test Thumbnail</h2>

            <img
              src="/images/tests-default.png"
              alt="Tests Default"
              className="w-full h-44 object-cover rounded-2xl bg-gray-200"
            />

            <div className="mt-6 bg-yellow-50 p-4 rounded-2xl text-sm text-yellow-800">
              यह admin-only test creator है। Public students को यह page show
              नहीं होगा।
            </div>

            <div className="mt-6 bg-purple-50 p-4 rounded-2xl text-sm text-purple-800">
              Save / Publish करने के बाद test public side पर दिखेगा:
              <br />
              <b>/tests</b>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}