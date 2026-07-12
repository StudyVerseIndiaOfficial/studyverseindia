"use client";

import Link from "next/link";
import { useMemo, useRef, useState, type CSSProperties } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type LayoutMode = "single" | "double" | "board";

type SubjectiveItem = {
  number: string;
  question: string;
  answer: string;
  exam?: string;
  date?: string;
  isContinuation?: boolean;
  forceOwnPage?: boolean;
};

type ThemePreset = {
  name: string;
  headerBg: string;
  headerText: string;
  chapter: string;
  question: string;
  answer: string;
  highlight: string;
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
    answer: "#111827",
    highlight: "#166534",
    background: "#fff7ed",
    border: "#f59e0b",
  },
  {
    name: "Blue + Cyan + White",
    headerBg: "#0f172a",
    headerText: "#67e8f9",
    chapter: "#0f172a",
    question: "#1d4ed8",
    answer: "#111827",
    highlight: "#047857",
    background: "#eff6ff",
    border: "#06b6d4",
  },
  {
    name: "Purple + Yellow + White",
    headerBg: "#581c87",
    headerText: "#fde047",
    chapter: "#111827",
    question: "#7e22ce",
    answer: "#111827",
    highlight: "#15803d",
    background: "#faf5ff",
    border: "#a855f7",
  },
  {
    name: "Green + Cream + Black",
    headerBg: "#14532d",
    headerText: "#fef3c7",
    chapter: "#111827",
    question: "#15803d",
    answer: "#111827",
    highlight: "#0f766e",
    background: "#fffbeb",
    border: "#22c55e",
  },
  {
    name: "Black + Red + White",
    headerBg: "#020617",
    headerText: "#ffffff",
    chapter: "#111827",
    question: "#dc2626",
    answer: "#111827",
    highlight: "#166534",
    background: "#f8fafc",
    border: "#ef4444",
  },
];

const demoText = `Mukhy Header: Study Verse India Subjective Premium PDF
Chapter: Indian Polity - Subjective Practice

Q1. संविधान क्या है?
Answer:
संविधान किसी देश का सर्वोच्च कानून होता है। इसके माध्यम से सरकार की संरचना, नागरिकों के अधिकार और कर्तव्य तथा शासन व्यवस्था निर्धारित होती है। संविधान राज्य की शक्तियों को सीमित करता है और नागरिकों की स्वतंत्रता की रक्षा करता है।

Exam Date: BPSC Mains Practice 2026

Q2. मौलिक अधिकारों का महत्व लिखिए।
Answer:
मौलिक अधिकार नागरिकों को स्वतंत्रता, समानता और न्याय प्रदान करते हैं। ये अधिकार व्यक्ति के सर्वांगीण विकास और लोकतांत्रिक व्यवस्था की रक्षा के लिए आवश्यक हैं। इनके माध्यम से नागरिक सरकार के मनमाने कार्यों के विरुद्ध न्यायालय जा सकते हैं।

Exam Date: BPSC Mains Practice 2026

Q3. राज्य के नीति निदेशक तत्व क्या हैं?
Answer:
राज्य के नीति निदेशक तत्व वे सिद्धांत हैं जिनके आधार पर सरकार लोक कल्याणकारी नीतियाँ बनाती है। ये न्यायालय में लागू नहीं कराए जा सकते, लेकिन शासन व्यवस्था को सामाजिक और आर्थिक न्याय की दिशा देते हैं।

Exam Date: BPSC Mains Practice 2026`;

function parseSubjectiveText(text: string) {
  const lines = text.replace(/\r/g, "").split("\n");

  let header = "Study Verse India";
  let chapter = "Subjective Practice Set";
  const items: SubjectiveItem[] = [];
  let current: SubjectiveItem | null = null;
  let readingAnswer = false;

  const saveCurrent = () => {
    if (current && current.question.trim()) {
      current.answer = current.answer.trimEnd();
      items.push(current);
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      if (current && readingAnswer) {
        current.answer += "\n";
      }
      continue;
    }

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
        number: questionMatch[1].replace(/\s+/g, "").replace(/[.)]+$/g, ""),
        question: questionMatch[2].trim(),
        answer: "",
      };

      readingAnswer = false;
      continue;
    }

    const examDateMatch = line.match(
      /^(exam date|exam\+date|exam name date|परीक्षा दिनांक)\s*[:\-]\s*(.+)$/i
    );

    if (examDateMatch && current) {
      current.exam = examDateMatch[2].trim();
      readingAnswer = false;
      continue;
    }

    const examMatch = line.match(/^(exam|exam name|परीक्षा)\s*[:\-]\s*(.+)$/i);

    if (examMatch && current) {
      current.exam = examMatch[2].trim();
      readingAnswer = false;
      continue;
    }

    const dateMatch = line.match(
      /^(date|exam date|दिनांक|तिथि)\s*[:\-]\s*(.+)$/i
    );

    if (dateMatch && current) {
      current.date = dateMatch[2].trim();
      readingAnswer = false;
      continue;
    }

    const answerMatch = line.match(/^(answer|ans|उत्तर)\s*[:\-]?\s*(.*)$/i);

    if (answerMatch && current) {
      readingAnswer = true;
      const answerText = answerMatch[2] ?? "";

      if (answerText.trim()) {
        current.answer += `${answerText.trimEnd()}\n`;
      }

      continue;
    }

    if (current) {
      if (readingAnswer) {
        current.answer += `${rawLine.trimEnd()}\n`;
      } else {
        current.question += ` ${line}`;
      }
    }
  }

  saveCurrent();

  return { header, chapter, items };
}

function splitAnswerIntoChunks(item: SubjectiveItem, layout: LayoutMode) {
  const cleanedAnswer = item.answer
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd();

  const maxChars =
    layout === "board" ? 700 : layout === "double" ? 1850 : 5600;

  const minLastChunkChars =
    layout === "board" ? 180 : layout === "double" ? 420 : 900;

  if (cleanedAnswer.length <= maxChars) {
    return [
      {
        ...item,
        answer: cleanedAnswer,
      },
    ];
  }

  const tokens = cleanedAnswer.match(/\S+\s*/g) || [];
  const chunks: string[] = [];
  let currentChunk = "";

  tokens.forEach((token) => {
    const nextChunk = currentChunk + token;

    if (nextChunk.length > maxChars) {
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trimEnd());
      }
      currentChunk = token;
    } else {
      currentChunk = nextChunk;
    }
  });

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trimEnd());
  }

  const lastChunk = chunks[chunks.length - 1];

  if (
    chunks.length > 1 &&
    lastChunk &&
    lastChunk.trim().length < minLastChunkChars
  ) {
    const last = chunks.pop();
    chunks[chunks.length - 1] = `${chunks[chunks.length - 1]}\n\n${last}`.trimEnd();
  }

  return chunks.map((chunk, index) => ({
    ...item,
    answer: chunk,
    question:
      index === 0 ? item.question : `${item.question} — Answer Continued`,
    isContinuation: index > 0,
    forceOwnPage: layout !== "board",
  }));
}

function prepareItems(items: SubjectiveItem[], layout: LayoutMode) {
  return items.flatMap((item) => splitAnswerIntoChunks(item, layout));
}

function estimateSubjectiveHeight(item: SubjectiveItem, layout: LayoutMode) {
  const questionCharsPerLine = layout === "double" ? 52 : 96;
  const answerCharsPerLine = layout === "double" ? 48 : 102;

  const questionLines = Math.max(
    1,
    Math.ceil(item.question.length / questionCharsPerLine)
  );

  const answerLines = Math.max(
    1,
    Math.ceil(item.answer.length / answerCharsPerLine)
  );

  let height = 44;
  height += questionLines * (layout === "double" ? 15 : 18);
  height += answerLines * (layout === "double" ? 13 : 14);

  if (item.exam || item.date) {
    height += 22;
  }

  return height;
}

function paginateSubjectiveItems(items: SubjectiveItem[], layout: LayoutMode) {
  const columnCount = layout === "double" ? 2 : 1;
  const maxHeight = layout === "double" ? 900 : 900;

  const pages: SubjectiveItem[][][] = [];
  let currentPage: SubjectiveItem[][] = Array.from(
    { length: columnCount },
    () => []
  );
  let columnHeights = Array.from({ length: columnCount }, () => 0);
  let columnIndex = 0;

  const currentPageHasContent = () =>
    currentPage.some((column) => column.length > 0);

  const pushPage = () => {
    if (currentPageHasContent()) {
      pages.push(currentPage);
    }

    currentPage = Array.from({ length: columnCount }, () => []);
    columnHeights = Array.from({ length: columnCount }, () => 0);
    columnIndex = 0;
  };

  items.forEach((item) => {
    const height = estimateSubjectiveHeight(item, layout);

    if (item.forceOwnPage) {
      pushPage();

      const ownPage: SubjectiveItem[][] = Array.from(
        { length: columnCount },
        () => []
      );

      ownPage[0].push(item);
      pages.push(ownPage);

      currentPage = Array.from({ length: columnCount }, () => []);
      columnHeights = Array.from({ length: columnCount }, () => 0);
      columnIndex = 0;

      return;
    }

    if (columnHeights[columnIndex] + height > maxHeight) {
      if (columnIndex < columnCount - 1) {
        columnIndex += 1;
      } else {
        pushPage();
      }
    }

    currentPage[columnIndex].push(item);
    columnHeights[columnIndex] += height + 12;
  });

  pushPage();

  return pages;
}

function safeFileName(text: string) {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9\u0900-\u097F]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 70) || "subjective-premium-pdf"
  );
}

export default function SubjectivePdfMakerPage() {
  const previewRef = useRef<HTMLDivElement | null>(null);

  const [bulkText, setBulkText] = useState(demoText);
  const [layout, setLayout] = useState<LayoutMode>("single");
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [colors, setColors] = useState<ThemePreset>(themePresets[0]);

  const parsed = useMemo(() => parseSubjectiveText(bulkText), [bulkText]);

  const preparedItems = useMemo(
    () => prepareItems(parsed.items, layout),
    [parsed.items, layout]
  );

  const pages = useMemo(() => {
    if (layout === "board") {
      return preparedItems.map((item) => [[item]]);
    }

    return paginateSubjectiveItems(preparedItems, layout);
  }, [preparedItems, layout]);

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
      alert("PDF preview empty है। पहले material paste करें।");
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
              Subjective Question Answer PDF Maker
            </h1>

            <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-gray-600">
              Simple question-answer text paste करें और उसे premium colourful
              A4 PDF या Digital Board Slide PDF में convert करें।
            </p>
          </div>

          <button
            onClick={downloadPdf}
            disabled={isDownloading || preparedItems.length === 0}
            className="rounded-2xl bg-red-900 px-6 py-4 text-sm font-black text-white shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDownloading ? "PDF बन रहा है..." : "Download PDF"}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[430px_1fr]">
          <section className="rounded-[2rem] border border-red-100 bg-white p-5 shadow-xl">
            <h2 className="mb-4 text-xl font-black text-red-950">
              Subjective PDF Control Panel
            </h2>

            <label className="mb-2 block text-sm font-black text-gray-700">
              Bulk Subjective Question Answer Text
            </label>

            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              className="h-80 w-full resize-none rounded-3xl border border-red-100 bg-red-50/40 p-4 text-sm font-bold leading-7 outline-none focus:border-red-700"
              placeholder="Mukhy Header, Chapter, Q1, Answer, Exam Date paste करें..."
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
                label="Answer"
                value={colors.answer}
                onChange={(value) => setColors({ ...colors, answer: value })}
              />
              <ColorInput
                label="Highlight"
                value={colors.highlight}
                onChange={(value) =>
                  setColors({ ...colors, highlight: value })
                }
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
                Parsed Q&A: {parsed.items.length}
              </p>
              <p className="mt-1 text-xs font-bold text-gray-600">
                Long answer auto split होकर continued page/slide में जाएगा।
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
                      Subjective material paste करें, preview यहाँ दिखेगा।
                    </p>
                  </div>
                ) : (
                  pages.map((page, pageIndex) => {
                    if (layout === "board") {
                      const item = page[0]?.[0];

                      if (!item) {
                        return null;
                      }

                      return (
                        <SubjectiveBoardPage
                          key={pageIndex}
                          item={item}
                          pageNumber={pageIndex + 1}
                          totalPages={pages.length}
                          header={parsed.header}
                          chapter={parsed.chapter}
                          colors={colors}
                        />
                      );
                    }

                    return (
                      <SubjectiveA4Page
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

function SubjectiveA4Page({
  page,
  pageNumber,
  totalPages,
  header,
  chapter,
  colors,
  layout,
}: {
  page: SubjectiveItem[][];
  pageNumber: number;
  totalPages: number;
  header: string;
  chapter: string;
  colors: ThemePreset;
  layout: LayoutMode;
}) {
  const pageStyle: CSSProperties = {
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

  return (
    <div data-pdf-page="true" style={pageStyle}>
      <div
        style={{
          borderRadius: "18px",
          border: `3px solid ${colors.border}`,
          padding: "12px 18px",
          textAlign: "center",
          background: colors.headerBg,
          color: colors.headerText,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "26px",
            lineHeight: "1.18",
            fontWeight: 900,
          }}
        >
          {header}
        </h1>
      </div>

      <div style={{ marginTop: "10px", textAlign: "center" }}>
        <h2
          style={{
            display: "inline-block",
            borderRadius: "14px",
            border: `2px solid ${colors.border}`,
            background: "#ffffff",
            padding: "7px 18px",
            color: colors.chapter,
            fontSize: "20px",
            lineHeight: "1.2",
            fontWeight: 900,
          }}
        >
          {chapter}
        </h2>
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
            {column.map((item, index) => (
              <SubjectiveBlock
                key={`${item.number}-${index}`}
                item={item}
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

function SubjectiveBlock({
  item,
  colors,
  layout,
}: {
  item: SubjectiveItem;
  colors: ThemePreset;
  layout: LayoutMode;
}) {
  const examDateText = [item.exam, item.date].filter(Boolean).join(" ");

  const answerParagraphs = item.answer
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trimEnd())
    .filter((paragraph) => paragraph.trim().length > 0);
    const isFullPageAnswer = item.forceOwnPage === true;

const answerFontSize = isFullPageAnswer
  ? layout === "double"
    ? "9px"
    : item.answer.length > 5000
      ? "9.2px"
      : "10px"
  : layout === "double"
    ? "10.2px"
    : "11.8px";

const answerLineHeight = isFullPageAnswer ? "1.28" : "1.42";

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        marginBottom: layout === "double" ? "8px" : "10px",
        border: `1.6px solid ${colors.border}`,
        borderRadius: "13px",
        background: "#ffffff",
        padding: layout === "double" ? "8px" : "10px",
        boxSizing: "border-box",
        overflow: "hidden",
        breakInside: "avoid",
        pageBreakInside: "avoid",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          color: colors.question,
          fontSize: layout === "double" ? "13px" : "16px",
          lineHeight: "1.35",
          fontWeight: 900,
          marginBottom: "6px",
          whiteSpace: "normal",
          overflowWrap: "anywhere",
          wordBreak: "break-word",
        }}
      >
        {item.number}. {item.question}
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          borderRadius: "10px",
          background: "#ffffff",
          border: `1px solid ${colors.border}`,
          padding: layout === "double" ? "7px" : "9px",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {answerParagraphs.length === 0 ? (
          <p
            style={{
              margin: 0,
              color: "#6b7280",
              fontSize: layout === "double" ? "10.5px" : "12.5px",
              lineHeight: "1.5",
              fontWeight: 700,
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
              wordBreak: "break-word",
            }}
          >
            Answer not provided.
          </p>
        ) : (
          answerParagraphs.map((paragraph, index) => (
            <p
              key={index}
              style={{
                margin: index === 0 ? "0" : "10px 0 0",
                color: colors.answer,
               fontSize: answerFontSize,
lineHeight: answerLineHeight,
                fontWeight: 750,
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
                wordBreak: "break-word",
                maxWidth: "100%",
              }}
            >
              {item.isContinuation && index === 0 ? "Continued: " : ""}
              {paragraph}
            </p>
          ))
        )}
      </div>

      {examDateText && (
        <div
          style={{
            marginTop: "6px",
            display: "inline-block",
            maxWidth: "100%",
            borderRadius: "999px",
            padding: layout === "double" ? "3px 8px" : "4px 10px",
            background: colors.background,
            color: colors.headerBg,
            border: `1px solid ${colors.border}`,
            fontSize: layout === "double" ? "9.5px" : "11px",
            lineHeight: "1.2",
            fontWeight: 900,
            whiteSpace: "normal",
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          }}
        >
          {examDateText}
        </div>
      )}
    </div>
  );
}

function SubjectiveBoardPage({
  item,
  pageNumber,
  totalPages,
  header,
  chapter,
  colors,
}: {
  item: SubjectiveItem;
  pageNumber: number;
  totalPages: number;
  header: string;
  chapter: string;
  colors: ThemePreset;
}) {
  const examDateText = [item.exam, item.date].filter(Boolean).join(" ");

  const questionFontSize =
    item.question.length > 130
      ? "20px"
      : item.question.length > 85
        ? "23px"
        : "27px";

  const answerFontSize =
    item.answer.length > 650 ? "16px" : item.answer.length > 400 ? "18px" : "20px";

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
              marginBottom: "12px",
            }}
          >
            {item.number}. {item.question}
          </div>

       <div
  style={{
    width: "100%",
    maxWidth: "100%",
    border: `2px solid ${colors.border}`,
    borderRadius: "16px",
    background: colors.background,
    padding: "14px",
    color: colors.answer,
    fontSize: answerFontSize,
    lineHeight: "1.42",
    fontWeight: 800,
    minHeight: "145px",
    boxSizing: "border-box",
    overflow: "hidden",
    whiteSpace: "normal",
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  }}
>
  <div
  style={{
    width: "100%",
    maxWidth: "100%",
    border: `2px solid ${colors.border}`,
    borderRadius: "16px",
    background: colors.background,
    padding: "14px",
    color: colors.answer,
    fontSize: answerFontSize,
    lineHeight: "1.42",
    fontWeight: 800,
    minHeight: "145px",
    boxSizing: "border-box",
    overflow: "hidden",
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  }}
>
  {item.isContinuation ? "Continued: " : ""}
  {item.answer}
</div>
</div>

          {examDateText && (
            <div
              style={{
                marginTop: "14px",
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
          )}
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
        <span>Subjective Premium PDF</span>
      </div>
    </div>
  );
}