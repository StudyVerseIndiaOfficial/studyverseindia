"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type LayoutMode = "single" | "double" | "board";

type QuestionItem = {
  number: string;
  question: string;
  options: string[];
  answer?: string;
  exam?: string;
  date?: string;
};

type ThemePreset = {
  name: string;
  headerBg: string;
  headerText: string;
  chapter: string;
  question: string;
  option: string;
  answer: string;
  background: string;
  border: string;
};

const themePresets: ThemePreset[] = [
  {
    name: "Red + Golden + White",
    headerBg: "#7f1d1d",
    headerText: "#facc15",
    chapter: "#111827",
    question: "#dc2626",
    option: "#111827",
    answer: "#166534",
    background: "#fff7ed",
    border: "#f59e0b",
  },
  {
    name: "Blue + Cyan + White",
    headerBg: "#0f172a",
    headerText: "#67e8f9",
    chapter: "#0f172a",
    question: "#1d4ed8",
    option: "#111827",
    answer: "#047857",
    background: "#eff6ff",
    border: "#06b6d4",
  },
  {
    name: "Purple + Yellow + White",
    headerBg: "#581c87",
    headerText: "#fde047",
    chapter: "#111827",
    question: "#7e22ce",
    option: "#111827",
    answer: "#15803d",
    background: "#faf5ff",
    border: "#a855f7",
  },
  {
    name: "Green + Cream + Black",
    headerBg: "#14532d",
    headerText: "#fef3c7",
    chapter: "#111827",
    question: "#15803d",
    option: "#111827",
    answer: "#0f766e",
    background: "#fffbeb",
    border: "#22c55e",
  },
  {
    name: "Black + Red + White",
    headerBg: "#020617",
    headerText: "#ffffff",
    chapter: "#111827",
    question: "#dc2626",
    option: "#111827",
    answer: "#166534",
    background: "#f8fafc",
    border: "#ef4444",
  },
];

const demoText = `Mukhy Header: Study Verse India Practice PDF
Chapter: Bihar Special - History

Q1. बिहार राज्य का गठन कब हुआ था?
(A) 1912
(B) 1936
(C) 1947
(D) 1950
Answer: A
Exam: BPSC
Date: 2024

Q2. बिहार की राजधानी क्या है?
(A) गया
(B) पटना
(C) मुजफ्फरपुर
(D) भागलपुर
Answer: B
Exam: Bihar Police
Date: 2023

Q3. बख्तियार खिलजी ने किस विश्वविद्यालय को नष्ट किया था?
(A) नालंदा
(B) तक्षशिला
(C) विक्रमशिला
(D) वल्लभी
Answer: A
Exam: BPSC
Date: 2022`;
function parseBulkText(text: string) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  let header = "Study Verse India";
  let chapter = "Practice Set";
  const questions: QuestionItem[] = [];
  let current: QuestionItem | null = null;

  const saveCurrent = () => {
    if (current && current.question.trim()) {
      questions.push(current);
    }
  };

  for (const line of lines) {
    const headerMatch = line.match(
      /^(mukhy header|main header|header|मुख्य header|मुख्य शीर्षक)\s*[:\-]\s*(.+)$/i
    );

    const chapterMatch = line.match(
      /^(chapter|chapter name|अध्याय|topic|विषय)\s*[:\-]\s*(.+)$/i
    );

    if (headerMatch) {
      header = headerMatch[2].trim();
      continue;
    }

    if (chapterMatch) {
      chapter = chapterMatch[2].trim();
      continue;
    }

    const questionMatch = line.match(
      /^(Q\.?\s*\d+|Q\d+|\d+[\.\)]?)\s*[\.\)]?\s*(.+)$/i
    );

    if (questionMatch) {
      saveCurrent();

      current = {
        number: questionMatch[1]
          .replace(/\s+/g, "")
          .replace(/[.)]+$/g, ""),
        question: questionMatch[2].trim(),
        options: [],
      };

      continue;
    }

    const answerMatch = line.match(/^(answer|ans|उत्तर)\s*[:\-]\s*(.+)$/i);

    if (answerMatch && current) {
      current.answer = answerMatch[2].trim();
      continue;
    }

    const examDateMatch = line.match(
      /^(exam date|exam\+date|exam name date|परीक्षा दिनांक)\s*[:\-]\s*(.+)$/i
    );

    if (examDateMatch && current) {
      current.exam = examDateMatch[2].trim();
      continue;
    }

    const examMatch = line.match(/^(exam|exam name|परीक्षा)\s*[:\-]\s*(.+)$/i);

    if (examMatch && current) {
      current.exam = examMatch[2].trim();
      continue;
    }

    const dateMatch = line.match(
      /^(date|exam date|दिनांक|तिथि)\s*[:\-]\s*(.+)$/i
    );

    if (dateMatch && current) {
      current.date = dateMatch[2].trim();
      continue;
    }

    const optionMatch = line.match(
      /^(?:\(([A-Da-d])\)|([A-Da-d])[\.\)])\s*(.+)$/
    );

    if (optionMatch && current) {
      const optionLetter = (optionMatch[1] || optionMatch[2]).toUpperCase();
      const optionText = optionMatch[3].trim();

      current.options.push(`(${optionLetter}) ${optionText}`);
      continue;
    }

    if (current) {
      current.question += ` ${line}`;
    }
  }

  saveCurrent();

  return { header, chapter, questions };
}

function estimateQuestionHeight(question: QuestionItem, layout: LayoutMode) {
  const questionCharsPerLine = layout === "double" ? 48 : 88;
  const optionCharsPerLine = layout === "double" ? 44 : 82;

  const questionLines = Math.max(
    1,
    Math.ceil(question.question.length / questionCharsPerLine)
  );

  const optionLines = question.options.reduce((total, option) => {
    return total + Math.max(1, Math.ceil(option.length / optionCharsPerLine));
  }, 0);

  let height = 26;
  height += questionLines * (layout === "double" ? 18 : 22);
  height += optionLines * (layout === "double" ? 16 : 19);

  if (question.exam || question.date) height += 22;
  if (question.answer) height += 26;

  return height;
}

function paginateQuestions(questions: QuestionItem[], layout: LayoutMode) {
const maxHeight = layout === "double" ? 905 : 900;
  const columnCount = layout === "double" ? 2 : 1;

  const pages: QuestionItem[][][] = [];
  let currentPage: QuestionItem[][] = Array.from(
    { length: columnCount },
    () => []
  );
  let columnHeights = Array.from({ length: columnCount }, () => 0);
  let columnIndex = 0;

  const pushPage = () => {
    pages.push(currentPage);
    currentPage = Array.from({ length: columnCount }, () => []);
    columnHeights = Array.from({ length: columnCount }, () => 0);
    columnIndex = 0;
  };

  questions.forEach((question) => {
    const height = estimateQuestionHeight(question, layout);

    if (columnHeights[columnIndex] + height > maxHeight) {
      if (columnIndex < columnCount - 1) {
        columnIndex += 1;
      } else {
        pushPage();
      }
    }

    currentPage[columnIndex].push(question);
    columnHeights[columnIndex] += height + 14;
  });

  if (currentPage.some((column) => column.length > 0)) {
    pages.push(currentPage);
  }

  return pages;
}

function safeFileName(text: string) {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9\u0900-\u097F]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 70) || "study-verse-india-pdf"
  );
}

export default function PdfMakerPage() {
  const previewRef = useRef<HTMLDivElement | null>(null);

  const [bulkText, setBulkText] = useState(demoText);
  const [layout, setLayout] = useState<LayoutMode>("single");
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [colors, setColors] = useState<ThemePreset>(themePresets[0]);

  const parsed = useMemo(() => parseBulkText(bulkText), [bulkText]);

 const pages = useMemo(() => {
  if (layout === "board") {
    return parsed.questions.map((question) => [[question]]);
  }

  return paginateQuestions(parsed.questions, layout);
}, [parsed.questions, layout]);

  const applyTheme = (index: number) => {
    setSelectedTheme(index);
    setColors(themePresets[index]);
  };

  const downloadPdf = async () => {
    if (!previewRef.current) return;

    const pageElements = Array.from(
      previewRef.current.querySelectorAll("[data-pdf-page='true']")
    ) as HTMLElement[];

    if (pageElements.length === 0) {
      alert("PDF preview empty है। पहले questions paste करें।");
      return;
    }

    setIsDownloading(true);

    try {
    const isBoardMode = layout === "board";

const pdf = isBoardMode
  ? new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: [297, 167.06],
    })
  : new jsPDF("p", "mm", "a4");

const pdfWidth = isBoardMode ? 297 : 210;
const pdfHeight = isBoardMode ? 167.06 : 297;

      for (let i = 0; i < pageElements.length; i++) {
        const canvas = await html2canvas(pageElements[i], {
          scale: 2,
          useCORS: true,
          backgroundColor: colors.background,
          logging: false,
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.98);

        if (i > 0) {
          pdf.addPage();
        }

       pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      }

      pdf.save(`${safeFileName(parsed.header)}.pdf`);
    } catch (error) {
      console.error(error);
      alert("PDF download में problem आई। Page refresh करके दुबारा try करें।");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 px-4 py-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link
              href="/admin"
              className="mb-3 inline-flex rounded-full bg-white px-4 py-2 text-sm font-black text-red-800 shadow"
            >
              ← Admin Panel
            </Link>

            <h1 className="text-3xl font-black text-red-950 md:text-5xl">
              Smart Question to Premium PDF Maker
            </h1>

            <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-gray-600">
              Bulk question text paste करें, single/double column choose करें,
              premium color select करें और direct PDF download करें।
            </p>
          </div>

          <button
            onClick={downloadPdf}
            disabled={isDownloading || parsed.questions.length === 0}
            className="rounded-2xl bg-red-900 px-6 py-4 text-sm font-black text-white shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDownloading ? "PDF बन रहा है..." : "Download PDF"}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[430px_1fr]">
          <section className="rounded-[2rem] border border-red-100 bg-white p-5 shadow-xl">
            <h2 className="mb-4 text-xl font-black text-red-950">
              PDF Control Panel
            </h2>

            <label className="mb-2 block text-sm font-black text-gray-700">
              Bulk Question Text Paste
            </label>

            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              className="h-80 w-full resize-none rounded-3xl border border-red-100 bg-red-50/40 p-4 text-sm font-bold leading-7 outline-none focus:border-red-700"
              placeholder="Mukhy Header, Chapter, Q1, A B C D, Answer, Exam, Date paste करें..."
            />

            <div className="mt-5 grid grid-cols-3 gap-3">
  <button
    onClick={() => setLayout("single")}
    className={`rounded-2xl px-4 py-3 text-xs font-black ${
      layout === "single"
        ? "bg-red-900 text-white"
        : "bg-red-50 text-red-900"
    }`}
  >
    Single
  </button>

  <button
    onClick={() => setLayout("double")}
    className={`rounded-2xl px-4 py-3 text-xs font-black ${
      layout === "double"
        ? "bg-red-900 text-white"
        : "bg-red-50 text-red-900"
    }`}
  >
    Double
  </button>

  <button
    onClick={() => setLayout("board")}
    className={`rounded-2xl px-4 py-3 text-xs font-black ${
      layout === "board"
        ? "bg-red-900 text-white"
        : "bg-red-50 text-red-900"
    }`}
  >
    Board PDF
  </button>
</div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-black text-gray-700">
                Auto Premium Color Combination
              </label>

              <select
                value={selectedTheme}
                onChange={(e) => applyTheme(Number(e.target.value))}
                className="w-full rounded-2xl border border-red-100 bg-white px-4 py-3 text-sm font-black outline-none"
              >
                {themePresets.map((theme, index) => (
                  <option key={theme.name} value={index}>
                    {theme.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <ColorInput
                label="Header BG"
                value={colors.headerBg}
                onChange={(value) => setColors({ ...colors, headerBg: value })}
              />
              <ColorInput
                label="Header Text"
                value={colors.headerText}
                onChange={(value) =>
                  setColors({ ...colors, headerText: value })
                }
              />
              <ColorInput
                label="Chapter"
                value={colors.chapter}
                onChange={(value) => setColors({ ...colors, chapter: value })}
              />
              <ColorInput
                label="Question"
                value={colors.question}
                onChange={(value) => setColors({ ...colors, question: value })}
              />
              <ColorInput
                label="Option"
                value={colors.option}
                onChange={(value) => setColors({ ...colors, option: value })}
              />
              <ColorInput
                label="Answer"
                value={colors.answer}
                onChange={(value) => setColors({ ...colors, answer: value })}
              />
              <ColorInput
                label="Background"
                value={colors.background}
                onChange={(value) =>
                  setColors({ ...colors, background: value })
                }
              />
              <ColorInput
                label="Border"
                value={colors.border}
                onChange={(value) => setColors({ ...colors, border: value })}
              />
            </div>

            <div className="mt-6 rounded-3xl bg-red-50 p-4">
              <p className="text-sm font-black text-red-950">
                Parsed Questions: {parsed.questions.length}
              </p>
              <p className="mt-1 text-xs font-bold text-gray-600">
                Question cut protection enabled: fit नहीं होगा तो next
                column/page में जाएगा।
              </p>
            </div>
          </section>

          <section className="min-w-0 rounded-[2rem] border border-red-100 bg-white p-4 shadow-xl">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-red-950">
                  Live PDF Preview
                </h2>
                <p className="text-xs font-bold text-gray-500">
                  यही layout PDF में download होगा।
                </p>
              </div>

              <span className="rounded-full bg-red-50 px-4 py-2 text-xs font-black text-red-800">
                {layout === "board"
  ? "Digital Board Slide PDF"
  : layout === "single"
    ? "Single Column A4"
    : "Double Column A4"}
              </span>
            </div>

            <div className="max-h-[82vh] overflow-auto rounded-3xl bg-gray-100 p-4">
              <div ref={previewRef} className="mx-auto flex w-fit flex-col gap-8">
                {pages.length === 0 ? (
                  <div className="flex h-[520px] w-[360px] items-center justify-center rounded-3xl bg-white p-6 text-center shadow">
                    <p className="text-sm font-black text-gray-500">
                      Questions paste करें, preview यहाँ दिखेगा।
                    </p>
                  </div>
                ) : (
             pages.map((page, pageIndex) => {
  if (layout === "board") {
    const question = page[0]?.[0];

    if (!question) {
      return null;
    }

    return (
      <BoardPreviewPage
        key={pageIndex}
        question={question}
        pageNumber={pageIndex + 1}
        totalPages={pages.length}
        header={parsed.header}
        chapter={parsed.chapter}
        colors={colors}
      />
    );
  }

  return (
    <PdfPreviewPage
      key={pageIndex}
      page={page}
      pageNumber={pageIndex + 1}
      totalPages={pages.length}
      header={parsed.header}
      chapter={parsed.chapter}
      colors={colors}
      layout={layout}
    />
  );
})
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black text-gray-600">
        {label}
      </span>

      <div className="flex items-center gap-2 rounded-2xl border border-red-100 bg-white p-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 cursor-pointer rounded-xl border-0 bg-transparent"
        />

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 text-xs font-black outline-none"
        />
      </div>
    </label>
  );
}

function PdfPreviewPage({
  page,
  pageNumber,
  totalPages,
  header,
  chapter,
  colors,
  layout,
}: {
  page: QuestionItem[][];
  pageNumber: number;
  totalPages: number;
  header: string;
  chapter: string;
  colors: ThemePreset;
  layout: LayoutMode;
}) {
  const pageStyle: React.CSSProperties = {
    width: "794px",
    height: "1123px",
    minHeight: "1123px",
    maxHeight: "1123px",
    background: colors.background,
    padding: "24px",
    boxSizing: "border-box",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Noto Sans Devanagari', 'Mangal', Arial, sans-serif",
    color: "#111827",
  };

  const headerStyle: React.CSSProperties = {
    borderRadius: "18px",
    border: `3px solid ${colors.border}`,
    padding: "12px 18px",
    textAlign: "center",
    background: colors.headerBg,
    color: colors.headerText,
  };

  const chapterStyle: React.CSSProperties = {
    display: "inline-block",
    borderRadius: "14px",
    border: `2px solid ${colors.border}`,
    background: "#ffffff",
    padding: "7px 18px",
    color: colors.chapter,
    fontSize: "20px",
    lineHeight: "1.2",
    fontWeight: 900,
  };

  return (
    <div data-pdf-page="true" style={pageStyle}>
      <div style={headerStyle}>
        <h1
          style={{
            margin: 0,
            fontSize: "26px",
            lineHeight: "1.18",
            fontWeight: 900,
            letterSpacing: "0.2px",
          }}
        >
          {header}
        </h1>
      </div>

      <div style={{ marginTop: "10px", textAlign: "center" }}>
        <h2 style={chapterStyle}>{chapter}</h2>
      </div>

      <div
        style={{
          marginTop: "14px",
          display: "grid",
          gridTemplateColumns: layout === "double" ? "1fr 1fr" : "1fr",
          gap: layout === "double" ? "10px" : "12px",
        }}
      >
        {page.map((column, columnIndex) => (
          <div key={columnIndex}>
            {column.map((question, index) => (
              <QuestionBlock
                key={`${question.number}-${index}`}
                question={question}
                colors={colors}
                layout={layout}
              />
            ))}
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: "24px",
          right: "24px",
          bottom: "12px",
          borderTop: "1px solid #d1d5db",
          paddingTop: "7px",
          display: "flex",
          justifyContent: "space-between",
          color: "#4b5563",
          fontSize: "10px",
          fontWeight: 900,
        }}
      >
        <span>Study Verse India</span>
        <span>
          Page {pageNumber} / {totalPages}
        </span>
      </div>
    </div>
  );
}

function QuestionBlock({
  question,
  colors,
  layout,
}: {
  question: QuestionItem;
  colors: ThemePreset;
  layout: LayoutMode;
}) {
  const examDateText = [question.exam, question.date].filter(Boolean).join(" ");

  return (
    <div
      style={{
        marginBottom: layout === "double" ? "8px" : "10px",
        border: `1.6px solid ${colors.border}`,
        borderRadius: "13px",
        background: "#ffffff",
        padding: layout === "double" ? "8px" : "10px",
        boxSizing: "border-box",
        breakInside: "avoid",
        pageBreakInside: "avoid",
      }}
    >
      <div
        style={{
          color: colors.question,
          fontSize: layout === "double" ? "13px" : "16px",
          lineHeight: "1.35",
          fontWeight: 900,
          marginBottom: "5px",
        }}
      >
        {question.number}. {question.question}
      </div>

      <div>
        {question.options.map((option) => (
          <div
            key={option}
            style={{
              color: colors.option,
              fontSize: layout === "double" ? "11.5px" : "14px",
              lineHeight: "1.35",
              fontWeight: 800,
              marginBottom: "2px",
            }}
          >
            {option}
          </div>
        ))}
      </div>

      {examDateText && (
        <div
          style={{
            marginTop: "6px",
            display: "inline-block",
            borderRadius: "999px",
            padding: layout === "double" ? "3px 8px" : "4px 10px",
            background: colors.background,
            color: colors.headerBg,
            border: `1px solid ${colors.border}`,
            fontSize: layout === "double" ? "9.5px" : "11px",
            lineHeight: "1.2",
            fontWeight: 900,
          }}
        >
          {examDateText}
        </div>
      )}

      {question.answer && (
        <div
          style={{
            marginTop: "6px",
            borderRadius: "9px",
            padding: layout === "double" ? "5px 8px" : "6px 9px",
            background: "#ecfdf5",
            border: `1px solid ${colors.answer}`,
          }}
        >
          <span
            style={{
              color: colors.answer,
              fontSize: layout === "double" ? "10.5px" : "12.5px",
              fontWeight: 900,
            }}
          >
            Answer: {question.answer}
          </span>
        </div>
      )}
    </div>
  );
}
function BoardPreviewPage({
  question,
  pageNumber,
  totalPages,
  header,
  chapter,
  colors,
}: {
  question: QuestionItem;
  pageNumber: number;
  totalPages: number;
  header: string;
  chapter: string;
  colors: ThemePreset;
}) {
  const examDateText = [question.exam, question.date].filter(Boolean).join(" ");

  const questionFontSize =
    question.question.length > 140
      ? "22px"
      : question.question.length > 90
        ? "25px"
        : "29px";

  const optionFontSize = question.options.some((option) => option.length > 45)
    ? "17px"
    : "20px";

  return (
    <div
      data-pdf-page="true"
      style={{
        width: "900px",
        height: "506px",
        background: `linear-gradient(135deg, ${colors.headerBg} 0%, #020617 55%, ${colors.headerBg} 100%)`,
        padding: "22px",
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Noto Sans Devanagari', 'Mangal', Arial, sans-serif",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "12px",
          border: `2px solid ${colors.border}`,
          borderRadius: "24px",
          opacity: 0.9,
        }}
      />

      <div
        style={{
          position: "absolute",
          right: "-80px",
          top: "-80px",
          width: "230px",
          height: "230px",
          borderRadius: "999px",
          background: colors.border,
          opacity: 0.18,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "-70px",
          bottom: "-70px",
          width: "210px",
          height: "210px",
          borderRadius: "999px",
          background: colors.headerText,
          opacity: 0.13,
        }}
      />

      <div style={{ position: "relative", zIndex: 2 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "14px",
          }}
        >
          <div
            style={{
              maxWidth: "620px",
              background: colors.headerText,
              color: colors.headerBg,
              padding: "8px 20px",
              borderRadius: "999px",
              fontSize: "19px",
              lineHeight: "1.2",
              fontWeight: 900,
              boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {header}
          </div>

          <div
            style={{
              border: `2px solid ${colors.border}`,
              color: "#ffffff",
              padding: "7px 16px",
              borderRadius: "999px",
              fontSize: "14px",
              fontWeight: 900,
              background: "rgba(255,255,255,0.08)",
              whiteSpace: "nowrap",
            }}
          >
            Slide {pageNumber}/{totalPages}
          </div>
        </div>

        <div style={{ marginTop: "12px", textAlign: "center" }}>
          <span
            style={{
              display: "inline-block",
              maxWidth: "780px",
              background: "#ffffff",
              color: colors.chapter,
              border: `2px solid ${colors.border}`,
              padding: "7px 24px",
              borderRadius: "15px",
              fontSize: "22px",
              lineHeight: "1.2",
              fontWeight: 900,
              boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {chapter}
          </span>
        </div>

        <div
          style={{
            marginTop: "17px",
            background: "rgba(255,255,255,0.97)",
            color: "#111827",
            border: `3px solid ${colors.border}`,
            borderRadius: "22px",
            padding: "20px",
            minHeight: "310px",
            boxShadow: "0 20px 44px rgba(0,0,0,0.34)",
          }}
        >
          <div
            style={{
              color: colors.question,
              fontSize: questionFontSize,
              lineHeight: "1.25",
              fontWeight: 900,
              marginBottom: "16px",
            }}
          >
            {question.number}. {question.question}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "11px",
            }}
          >
            {question.options.map((option) => (
              <div
                key={option}
                style={{
                  border: `1.8px solid ${colors.border}`,
                  borderRadius: "14px",
                  padding: "9px 14px",
                  background: colors.background,
                  color: colors.option,
                  fontSize: optionFontSize,
                  lineHeight: "1.22",
                  fontWeight: 900,
                  overflow: "hidden",
                }}
              >
                {option}
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            {examDateText ? (
              <div
                style={{
                  display: "inline-block",
                  borderRadius: "999px",
                  padding: "6px 14px",
                  background: colors.headerBg,
                  color: "#ffffff",
                  border: `1.8px solid ${colors.border}`,
                  fontSize: "14px",
                  lineHeight: "1.2",
                  fontWeight: 900,
                }}
              >
                {examDateText}
              </div>
            ) : (
              <span />
            )}

            {question.answer && (
              <div
                style={{
                  borderRadius: "13px",
                  padding: "7px 16px",
                  background: "#ecfdf5",
                  color: colors.answer,
                  border: `1.8px solid ${colors.answer}`,
                  fontSize: "16px",
                  fontWeight: 900,
                  whiteSpace: "nowrap",
                }}
              >
                Answer: {question.answer}
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: "32px",
          right: "32px",
          bottom: "16px",
          display: "flex",
          justifyContent: "space-between",
          color: "rgba(255,255,255,0.82)",
          fontSize: "12px",
          fontWeight: 900,
          zIndex: 2,
        }}
      >
        <span>Study Verse India</span>
        <span>Premium Digital Board PDF</span>
      </div>
    </div>
  );
}