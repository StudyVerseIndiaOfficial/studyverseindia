"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Question = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

type TestItem = {
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
  durationMinutes?: number;
  questions?: Question[];
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
      return "/images/tests-default.png";
  }
};

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

export default function PublicTestsPage() {
  const [tests, setTests] = useState<TestItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedTest, setSelectedTest] = useState<TestItem | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const activeQuestions = selectedTest?.questions || [];

  useEffect(() => {
    const loadTests = async () => {
      try {
        const snapshot = await getDocs(collection(db, "adminItems"));

        const data: TestItem[] = snapshot.docs
          .map((docItem) => ({
            id: docItem.id,
            ...(docItem.data() as Omit<TestItem, "id">),
          }))
          .filter(
            (item) =>
              item.module === "Tests" &&
              item.published === true &&
              item.questions &&
              item.questions.length > 0
          );

        setTests(data);
      } catch (error) {
        console.log(error);
        alert("Tests load नहीं हो पा रहा है।");
      } finally {
        setLoading(false);
      }
    };

    loadTests();
  }, []);

  useEffect(() => {
    if (!testStarted || showResult || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowResult(true);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, showResult, timeLeft]);

  const startTest = (test: TestItem) => {
    const duration = test.durationMinutes || 10;

    setSelectedTest(test);
    setSelectedAnswers([]);
    setShowResult(false);
    setTestStarted(true);
    setTimeLeft(duration * 60);
  };

  const quitTest = () => {
    const confirmQuit = confirm("क्या आप test छोड़ना चाहते हैं?");
    if (!confirmQuit) return;

    setSelectedTest(null);
    setSelectedAnswers([]);
    setShowResult(false);
    setTestStarted(false);
    setTimeLeft(0);
  };

  const handleSelect = (questionIndex: number, option: string) => {
    if (showResult) return;

    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[questionIndex] = option;
    setSelectedAnswers(updatedAnswers);
  };

  const totalQuestions = activeQuestions.length;

  const correct = activeQuestions.reduce((total, q, index) => {
    return selectedAnswers[index] === q.answer ? total + 1 : total;
  }, 0);

  const attempted = selectedAnswers.filter(Boolean).length;
  const wrong = attempted - correct;
  const unattempted = totalQuestions - attempted;
  const percentage =
    totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;

  if (testStarted && selectedTest) {
    return (
      <main className="min-h-screen bg-gray-100 px-5 py-8">
        <section className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold break-words">
                📝 {selectedTest.title}
              </h1>

              <p className="text-gray-600 break-words">
                {selectedTest.course || "Course"} →{" "}
                {selectedTest.subject || "Subject"} →{" "}
                {selectedTest.topic || "Topic"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`px-5 py-3 rounded-xl font-bold ${
                  timeLeft <= 60
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                ⏱ {formatTime(timeLeft)}
              </div>

              {!showResult && (
                <button
                  onClick={quitTest}
                  className="bg-red-600 text-white px-5 py-3 rounded-xl font-semibold"
                >
                  Quit Test
                </button>
              )}
            </div>
          </div>

          {showResult && timeLeft === 0 && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-6 font-semibold">
              ⏰ Time समाप्त हो गया। Test auto submit हो गया है।
            </div>
          )}

          <div className="space-y-6">
            {activeQuestions.map((q, index) => (
              <div
                key={`${q.question}-${index}`}
                className="bg-white p-6 rounded-3xl shadow-md"
              >
                <h2 className="text-xl font-semibold mb-4 break-words">
                  Q{index + 1}. {q.question}
                </h2>

                <div className="space-y-3">
                  {q.options.map((option) => {
                    const isSelected = selectedAnswers[index] === option;
                    const isCorrect = q.answer === option;

                    let optionStyle = "bg-gray-50 border-gray-200";

                    if (showResult && isCorrect) {
                      optionStyle =
                        "bg-green-100 border-green-500 text-green-800";
                    } else if (showResult && isSelected && !isCorrect) {
                      optionStyle = "bg-red-100 border-red-500 text-red-800";
                    } else if (isSelected) {
                      optionStyle = "bg-blue-600 border-blue-600 text-white";
                    }

                    return (
                      <button
                        key={option}
                        onClick={() => handleSelect(index, option)}
                        className={`block w-full text-left p-4 rounded-2xl border transition break-words ${optionStyle}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {showResult && (
                  <div className="mt-5 bg-gray-50 rounded-2xl p-4">
                    <p className="font-semibold">
                      सही उत्तर:{" "}
                      <span className="text-green-700">{q.answer}</span>
                    </p>

                    <p className="text-gray-600 mt-2 text-sm break-words">
                      Explanation: {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {!showResult && (
            <button
              onClick={() => setShowResult(true)}
              className="mt-8 bg-green-600 text-white px-6 py-4 rounded-2xl font-bold w-full md:w-auto"
            >
              Submit Test
            </button>
          )}

          {showResult && (
            <div className="mt-8 bg-white p-6 rounded-3xl shadow-xl">
              <h2 className="text-3xl font-bold mb-5">Result</h2>

              <div className="grid gap-4 md:grid-cols-5">
                <div className="bg-blue-50 rounded-2xl p-4 text-center">
                  <p className="text-sm text-gray-500">Score</p>
                  <h3 className="text-2xl font-bold">
                    {correct}/{totalQuestions}
                  </h3>
                </div>

                <div className="bg-green-50 rounded-2xl p-4 text-center">
                  <p className="text-sm text-gray-500">Correct</p>
                  <h3 className="text-2xl font-bold text-green-700">
                    {correct}
                  </h3>
                </div>

                <div className="bg-red-50 rounded-2xl p-4 text-center">
                  <p className="text-sm text-gray-500">Wrong</p>
                  <h3 className="text-2xl font-bold text-red-700">
                    {wrong}
                  </h3>
                </div>

                <div className="bg-orange-50 rounded-2xl p-4 text-center">
                  <p className="text-sm text-gray-500">Unattempted</p>
                  <h3 className="text-2xl font-bold text-orange-700">
                    {unattempted}
                  </h3>
                </div>

                <div className="bg-purple-50 rounded-2xl p-4 text-center">
                  <p className="text-sm text-gray-500">Percentage</p>
                  <h3 className="text-2xl font-bold text-purple-700">
                    {percentage}%
                  </h3>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={() => selectedTest && startTest(selectedTest)}
                  className="bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold"
                >
                  Retry Test
                </button>

                <button
                  onClick={() => {
                    setSelectedTest(null);
                    setTestStarted(false);
                    setShowResult(false);
                    setSelectedAnswers([]);
                    setTimeLeft(0);
                  }}
                  className="bg-gray-200 px-5 py-3 rounded-xl font-semibold"
                >
                  Back to Tests
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-5 py-8">
      <section className="max-w-6xl mx-auto">
        <a href="/" className="inline-block mb-6 text-blue-600 font-semibold">
          ← Back to Home
        </a>

        <h1 className="text-4xl font-bold mb-2">📝 Tests</h1>
 <div className="mb-5 rounded-2xl bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 border border-purple-100 p-4 shadow-sm">
  <p className="text-[17px] md:text-lg font-extrabold text-gray-900 leading-relaxed break-words line-clamp-3">
    {test.description}
  </p>

        {loading ? (
          <div className="bg-white rounded-3xl p-8 shadow text-center">
            Loading tests...
          </div>
        ) : tests.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 shadow text-center text-gray-500">
            अभी कोई published test उपलब्ध नहीं है।
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tests.map((test) => (
              <div
                key={test.id}
                className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition"
              >
                <img
                  src={test.imageUrl || getDefaultImage(test.module)}
                  alt={test.title}
                  className="w-full h-52 object-cover bg-gray-200"
                />

                <div className="p-5">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                      {test.course || "Online Test"}
                    </span>

                    {test.isLive && (
                      <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                        🔴 LIVE
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-bold mb-2 break-words">
                    {test.title}
                  </h2>

                  <p className="text-sm text-gray-500 mb-3">
                    📅 {test.date || "No date"}
                  </p>

                  <p className="text-gray-600 text-sm mb-4 break-words line-clamp-3">
                    {test.description}
                  </p>

                  <p className="text-xs text-gray-500 mb-4 break-words">
                    {test.subject || "Subject"} →{" "}
                    {test.chapter || "Chapter"} → {test.topic || "Topic"}
                  </p>

                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="border rounded-2xl p-3 text-center">
                      <p className="text-xs text-gray-500">Questions</p>
                      <h3 className="text-xl font-bold">
                        {test.questions?.length || 0}
                      </h3>
                    </div>

                    <div className="border rounded-2xl p-3 text-center">
                      <p className="text-xs text-gray-500">Marks</p>
                      <h3 className="text-xl font-bold">
                        {test.questions?.length || 0}
                      </h3>
                    </div>

                    <div className="border rounded-2xl p-3 text-center">
                      <p className="text-xs text-gray-500">Time</p>
                      <h3 className="text-xl font-bold">
                        {test.durationMinutes || 10}m
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => startTest(test)}
                    className="w-full bg-purple-700 text-white py-4 rounded-2xl font-bold hover:bg-purple-800 transition"
                  >
                    Start Test
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}