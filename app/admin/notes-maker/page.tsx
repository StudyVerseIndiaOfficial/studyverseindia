"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type NoteTheme = {
  name: string;
  background: string;
  headerBg: string;
  headerText: string;
  headingColor: string;
  accent: string;
  text: string;
  border: string;
  bulletColor: string;
  quoteBg: string;
};

type NoteStyle = "classic" | "elegant" | "minimal" | "colorful";

const themes: NoteTheme[] = [
  {
    name: "🔴 Classic Red Academic",
    background: "#fef2f2",
    headerBg: "#991b1b",
    headerText: "#ffffff",
    headingColor: "#dc2626",
    accent: "#ef4444",
    text: "#111827",
    border: "#fca5a5",
    bulletColor: "#dc2626",
    quoteBg: "#fef2f2",
  },
  {
    name: "🔵 Royal Blue Corporate",
    background: "#eff6ff",
    headerBg: "#1e3a5f",
    headerText: "#f0f9ff",
    headingColor: "#2563eb",
    accent: "#3b82f6",
    text: "#111827",
    border: "#93c5fd",
    bulletColor: "#1d4ed8",
    quoteBg: "#eff6ff",
  },
  {
    name: "🟢 Forest Green Fresh",
    background: "#f0fdf4",
    headerBg: "#14532d",
    headerText: "#dcfce7",
    headingColor: "#16a34a",
    accent: "#22c55e",
    text: "#111827",
    border: "#86efac",
    bulletColor: "#15803d",
    quoteBg: "#f0fdf4",
  },
  {
    name: "🟣 Purple Creative",
    background: "#faf5ff",
    headerBg: "#4c1d95",
    headerText: "#ede9fe",
    headingColor: "#9333ea",
    accent: "#a855f7",
    text: "#111827",
    border: "#c4b5fd",
    bulletColor: "#7e22ce",
    quoteBg: "#faf5ff",
  },
  {
    name: "🟠 Orange Warm",
    background: "#fff7ed",
    headerBg: "#9a3412",
    headerText: "#ffedd5",
    headingColor: "#ea580c",
    accent: "#f97316",
    text: "#111827",
    border: "#fdba74",
    bulletColor: "#c2410c",
    quoteBg: "#fff7ed",
  },
];

const fonts = [
  { name: "Inter (Modern)", value: "'Inter', 'Noto Sans Devanagari', sans-serif" },
  { name: "Poppins (Rounded)", value: "'Poppins', 'Noto Sans Devanagari', sans-serif" },
  { name: "Hind (Best Hindi)", value: "'Hind', 'Noto Sans Devanagari', 'Mangal', sans-serif" },
];

const demoNote = `बिहार का सम्पूर्ण इतिहास
प्राचीन काल

बिहार का नाम "विहार" शब्द से बना है जिसका अर्थ है बौद्ध भिक्षुओं का निवास स्थान। यह क्षेत्र प्राचीन काल में कई महाजनपदों का हिस्सा था।

महाजनपद काल
    - अंग, मगध, वज्जि संघ
    - सबसे शक्तिशाली – मगध साम्राज्य
हर्यंक वंश (बिम्बिसार, अजातशत्रु)
शिशुनाग वंश और नंद वंश का उदय हुआ।
मौर्य साम्राज्य – चन्द्रगुप्त मौर्य, बिन्दुसार, अशोक
    - अशोक के शिलालेख और स्तूप
    - कलिंग युद्ध के बाद बौद्ध धर्म अपनाया
गुप्त साम्राज्य (स्वर्ण युग) – चन्द्रगुप्त प्रथम, समुद्रगुप्त

बख्तियार खिलजी ने 12वीं सदी में नालन्दा विश्वविद्यालय को जलाकर नष्ट कर दिया।

मध्यकाल
- पाल वंश (8वीं–12वीं शताब्दी) – धर्मपाल, देवपाल
- शेर शाह सूरी (1540–1545) – ग्रैंड ट्रंक रोड, रुपया
- मुगल काल – बिहार बंगाल सूबे का हिस्सा

आधुनिक काल
1. 1912 – बिहार और उड़ीसा बंगाल से अलग हुए।
2. 1936 – बिहार और उड़ीसा अलग-अलग प्रान्त बने।
3. 1947 – स्वतन्त्रता, बिहार भारत का हिस्सा।
4. 2000 – झारखण्ड बिहार से अलग हुआ।

प्रमुख व्यक्तित्व
- डॉ. राजेन्द्र प्रसाद – भारत के प्रथम राष्ट्रपति
- जयप्रकाश नारायण – सम्पूर्ण क्रान्ति के नेता
- कुँवर सिंह – 1857 की क्रान्ति के महानायक

भूगोल और प्राकृतिक संसाधन
- क्षेत्रफल – 94,163 वर्ग किलोमीटर
- राजधानी – पटना
- प्रमुख नदियाँ – गंगा, सोन, गंडक, कोसी, बागमती
- जलवायु – मानसूनी
- प्रमुख फसलें – धान, गेहूँ, मक्का, गन्ना

पर्यटन स्थल
- बोधगया – महाबोधि मंदिर (यूनेस्को विश्व धरोहर)
- राजगीर – गर्म जलकुंड, पहाड़ियाँ
- नालन्दा – प्राचीन विश्वविद्यालय के भग्नावशेष
- वैशाली – अशोक स्तंभ
- पटना – गोलघर, पटना म्यूजियम, हरमंदिर साहिब

शिक्षा और साहित्य
- प्राचीन विश्वविद्यालय – नालन्दा, विक्रमशिला
- आधुनिक संस्थान – पटना विश्वविद्यालय, आईआईटी पटना
- प्रमुख साहित्यकार – रामधारी सिंह दिनकर (राष्ट्रकवि), फणीश्वर नाथ रेणु

अर्थव्यवस्था
- मुख्यतः कृषि आधारित अर्थव्यवस्था
- सेवा क्षेत्र और लघु उद्योगों का विकास
- तेजी से बढ़ते शहर – पटना, गया, मुजफ्फरपुर

लोक संस्कृति और त्यौहार
- छठ पूजा – सबसे बड़ा और पवित्र त्यौहार
- लोक नृत्य – जट-जटिन, झूमर, कजरी
- मिथिला पेंटिंग – विश्व प्रसिद्ध कला शैली

पारंपरिक भोजन
- लिट्टी चोखा – बिहार का सबसे प्रसिद्ध व्यंजन
- सत्तू – मुख्य आहार का हिस्सा
- मिठाइयाँ – खाजा, तिलकुट, पुआ
- मखाना – बिहार का विशेष उत्पाद

राजनीतिक इतिहास
- चंपारण सत्याग्रह – गांधी जी का भारत में पहला आंदोलन
- 1942 का भारत छोड़ो आंदोलन
- 1974 का छात्र आंदोलन – जयप्रकाश नारायण के नेतृत्व में
- सम्पूर्ण क्रान्ति – लोकतंत्र की रक्षा का आंदोलन

वन्यजीव और पर्यावरण
- वाल्मीकि राष्ट्रीय उद्यान – बाघ अभयारण्य
- प्रमुख वन्यजीव – चीतल, सांभर, जंगली भैंसा
- गंगा नदी में डॉल्फिन संरक्षण

खेल
- क्रिकेट – सबसे लोकप्रिय खेल
- कबड्डी, कुश्ती और फुटबॉल
- खेल अकादमियों और स्टेडियम का विकास

निष्कर्ष
बिहार एक ऐतिहासिक, सांस्कृतिक और आध्यात्मिक रूप से समृद्ध राज्य है। इसमें अपार संभावनाएँ हैं और यह दिन-प्रतिदिन प्रगति कर रहा है। सही दिशा और प्रयास से यह राज्य फिर से देश का नेतृत्व कर सकता है।`;

function autoFormatPlainText(raw: string): string {
  const lines = raw.split("\n");
  const result: string[] = [];
  let isFirst = true;

  for (const line of lines) {
    const trimmed = line.trimEnd();
    const content = trimmed.trimStart();
    if (content === "") { result.push(""); continue; }

    if (content.startsWith("#") || content.startsWith("- ") || content.startsWith("> ") || content.match(/^\d+\.\s/) || content.startsWith("```")) {
      result.push(content); isFirst = false; continue;
    }

    if (isFirst) { result.push(`# ${content}`); isFirst = false; continue; }

    if (content.endsWith(":") && content.length < 60) {
      result.push(`## ${content.replace(/:$/, "").trim()}`); continue;
    }

    if (content.length < 50 && !/[।.?!]/.test(content) && content.indexOf(":") === -1) {
      if (!/[a-zA-Z0-9]/.test(content) || content.split(" ").length <= 5) {
        result.push(`### ${content}`); continue;
      }
    }

    const numberedMatch = content.match(/^(\d+)\.\s+(.+)/);
    if (numberedMatch) { result.push(content); continue; }

    if (trimmed !== content) { result.push(`    - ${content}`); continue; }
    if (content.startsWith("- ") || content.startsWith("* ")) { result.push(content); continue; }

    result.push(content);
  }

  return result.join("\n");
}

type Block = {
  type: "h2" | "h3" | "bullet" | "subbullet" | "numbered" | "quote" | "divider" | "text";
  content: string;
};

function parseNoteText(text: string): { blocks: Block[]; title: string } {
  const lines = text.split("\n");
  const blocks: Block[] = [];
  let title = "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "") continue;

    if (trimmed.startsWith("# ") && !title) {
      title = trimmed.replace("# ", "").trim(); continue;
    }

    if (trimmed.startsWith("## ")) {
      blocks.push({ type: "h2", content: trimmed.replace("## ", "").trim() });
    } else if (trimmed.startsWith("### ")) {
      blocks.push({ type: "h3", content: trimmed.replace("### ", "").trim() });
    } else if (trimmed.startsWith("> ")) {
      blocks.push({ type: "quote", content: trimmed.replace("> ", "").trim() });
    } else if (trimmed.match(/^(\d+)\.\s/)) {
      blocks.push({ type: "numbered", content: trimmed });
    } else if (trimmed.startsWith("- ")) {
      blocks.push({ type: "bullet", content: trimmed.replace("- ", "").trim() });
    } else if (trimmed.startsWith("    - ") || trimmed.startsWith("\t- ")) {
      blocks.push({ type: "subbullet", content: trimmed.replace(/^\s+-\s/, "").trim() });
    } else if (trimmed.startsWith("---") || trimmed.startsWith("***")) {
      blocks.push({ type: "divider", content: "" });
    } else {
      blocks.push({ type: "text", content: trimmed });
    }
  }

  if (!title) title = "Untitled Notes";
  return { blocks, title };
}

// Height estimation – slightly overestimated for safety
function estimateBlockHeight(block: Block): number {
  switch (block.type) {
    case "h2": return 50;
    case "h3": return 36;
    case "bullet": case "numbered": return 24;
    case "subbullet": return 20;
    case "quote": {
      const charWidth = 0.7;
      const maxLineWidth = 700;
      const charsPerLine = Math.floor(maxLineWidth / charWidth);
      const lines = Math.ceil(block.content.length / charsPerLine);
      return (lines * 20) + 20;
    }
    case "divider": return 20;
    case "text": {
      const charWidth = 0.7;
      const maxLineWidth = 700;
      const charsPerLine = Math.floor(maxLineWidth / charWidth);
      const lines = Math.max(1, Math.ceil(block.content.length / charsPerLine));
      return (lines * 22) + 8;
    }
    default: return 24;
  }
}

// ✅ FIXED: Strict safe zone prevents any footer overlap
function paginateBlocks(blocks: Block[]): Block[][] {
  const PAGE_HEIGHT = 1123;
  const FIXED_SPACE = 273; // top padding(30)+header(88)+footer(40)+bottom padding(30)+content bottom pad(20)+extra safety(65)
  const AVAILABLE = PAGE_HEIGHT - FIXED_SPACE; // exactly 850px
  const HEADING_SAFE_ZONE = 100;

  const pages: Block[][] = [];
  let currentPage: Block[] = [];
  let currentHeight = 0;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const blockHeight = estimateBlockHeight(block);

    if (block.type === "h2" || block.type === "h3") {
      const spaceLeft = AVAILABLE - currentHeight;
      if (spaceLeft < HEADING_SAFE_ZONE && currentPage.length > 0) {
        pages.push(currentPage);
        currentPage = [];
        currentHeight = 0;
      }
    }

    if (currentHeight + blockHeight > AVAILABLE && currentPage.length > 0) {
      pages.push(currentPage);
      currentPage = [];
      currentHeight = 0;
    }

    currentPage.push(block);
    currentHeight += blockHeight;
  }

  if (currentPage.length > 0) pages.push(currentPage);
  return pages;
}

function waitForImages(container: HTMLElement): Promise<void> {
  const images = Array.from(container.querySelectorAll("img"));
  return Promise.all(
    images.map((img) => img.complete ? Promise.resolve() : new Promise<void>((resolve) => { img.onload = () => resolve(); img.onerror = () => resolve(); }))
  ).then(() => {});
}

export default function NotesMakerPage() {
  const previewRef = useRef<HTMLDivElement | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  const [noteText, setNoteText] = useState(demoNote);
  const [theme, setTheme] = useState(0);
  const [font, setFont] = useState(0);
  const [style, setStyle] = useState<NoteStyle>("classic");
  const [logoBase64, setLogoBase64] = useState<string>("");
  const [showWatermark, setShowWatermark] = useState(true);
  const [watermarkText, setWatermarkText] = useState("Smart Notes");
  const [showQR, setShowQR] = useState(true);
  const [qrValue, setQrValue] = useState("https://studyverseindia.com");
  const [brandName, setBrandName] = useState("Study Verse India");
  const [isExporting, setIsExporting] = useState(false);

  const colors = themes[theme];
  const fontFamily = fonts[font].value;
  const parsed = useMemo(() => parseNoteText(noteText), [noteText]);
  const pages = useMemo(() => paginateBlocks(parsed.blocks), [parsed.blocks]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("केवल image file upload करें।"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setLogoBase64(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSmartFormat = () => setNoteText(autoFormatPlainText(noteText));
const exportPDF = async () => {
  const pageElements = Array.from(
    previewRef.current?.querySelectorAll("[data-note-page]") || []
  ) as HTMLElement[];

  if (pageElements.length === 0) {
    alert("Preview empty है।");
    return;
  }

  setIsExporting(true);
  try {
    // सभी images (logo, QR) load होने का wait करें
    for (const el of pageElements) await waitForImages(el);

    const pdf = new jsPDF("p", "mm", "a4");

    for (let i = 0; i < pageElements.length; i++) {
      const el = pageElements[i];
      const canvas = await html2canvas(el, {
        scale: 2,                        // ✅ 2x (1588px wide – print quality)
        useCORS: true,
        allowTaint: false,
        backgroundColor: colors.background,
        logging: false,
        windowWidth: el.offsetWidth,
        windowHeight: el.offsetHeight,
        scrollY: 0,
      });

      // ✅ JPEG 92% quality – size घटेगा, quality बनी रहेगी
      const imgData = canvas.toDataURL("image/jpeg", 0.92);

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);
    }

    pdf.save(`${parsed.title.replace(/\s+/g, "-").toLowerCase()}.pdf`);
  } catch (err) {
    console.error(err);
    alert("Export error. Try again.");
  } finally {
    setIsExporting(false);
  }
};

  const renderStyle = () => {
    switch (style) {
      case "elegant": return { headerBorderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", notePadding: "24px" };
      case "minimal": return { headerBorderRadius: "0px", boxShadow: "none", notePadding: "16px" };
      case "colorful": return { headerBorderRadius: "24px", boxShadow: "0 8px 25px rgba(0,0,0,0.15)", notePadding: "20px" };
      default: return { headerBorderRadius: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", notePadding: "20px" };
    }
  };

  const styleProps = renderStyle();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link href="/pdf-maker" className="mb-3 inline-flex rounded-full bg-white px-4 py-2 text-sm font-black text-purple-800 shadow">← PDF Maker</Link>
            <h1 className="text-3xl font-black text-purple-950 md:text-5xl">✨ Smart Notes Maker</h1>
            <p className="mt-2 max-w-3xl text-sm font-bold leading-6 text-gray-600">✅ Ab kabhi koi shabd footer ke peeche nahi chhupega।</p>
          </div>
          <button onClick={exportPDF} disabled={isExporting || pages.length === 0} className="rounded-2xl bg-purple-900 px-6 py-4 text-sm font-black text-white shadow-xl disabled:cursor-not-allowed disabled:opacity-60">
            {isExporting ? "Exporting..." : "Download PDF"}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[430px_1fr]">
          <section className="rounded-[2rem] border border-purple-100 bg-white p-5 shadow-xl">
            <h2 className="mb-4 text-xl font-black text-purple-950">Control Panel</h2>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-black text-gray-700">📝 Your Note Text</label>
              <button onClick={handleSmartFormat} className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-1.5 text-xs font-black text-white shadow">🔮 Smart Format</button>
            </div>
            <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} className="h-80 w-full resize-none rounded-3xl border border-purple-100 bg-purple-50/40 p-4 text-sm font-bold leading-7 outline-none focus:border-purple-700" />

            <div className="mt-4">
              <label className="mb-2 block text-sm font-black text-gray-700">🎨 Color Theme</label>
              <select value={theme} onChange={(e) => setTheme(Number(e.target.value))} className="w-full rounded-2xl border border-purple-100 bg-white px-4 py-3 text-sm font-black outline-none">
                {themes.map((t, idx) => <option key={t.name} value={idx}>{t.name}</option>)}
              </select>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-black text-gray-700">🖌️ Font</label>
              <select value={font} onChange={(e) => setFont(Number(e.target.value))} className="w-full rounded-2xl border border-purple-100 bg-white px-4 py-3 text-sm font-black outline-none">
                {fonts.map((f, idx) => <option key={f.name} value={idx}>{f.name}</option>)}
              </select>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-black text-gray-700">✨ Style</label>
              <div className="grid grid-cols-2 gap-2">
                {(["classic", "elegant", "minimal", "colorful"] as NoteStyle[]).map((s) => (
                  <button key={s} onClick={() => setStyle(s)} className={`rounded-xl px-4 py-2 text-xs font-black capitalize ${style === s ? "bg-purple-900 text-white" : "bg-purple-50 text-purple-900"}`}>{s}</button>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/30 p-4">
              <label className="mb-2 block text-sm font-black text-gray-700">🏷️ Logo</label>
              <input ref={logoInputRef} type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={handleLogoUpload} className="w-full text-xs font-bold text-gray-600 file:mr-3 file:rounded-xl file:border-0 file:bg-purple-900 file:px-4 file:py-2 file:text-xs file:font-black file:text-white" />
              {logoBase64 && (
                <div className="mt-2 flex items-center gap-2">
                  <img src={logoBase64} alt="Logo" className="h-8 w-8 rounded-lg object-contain" />
                  <span className="text-xs font-bold text-green-700">✓ Logo set</span>
                  <button onClick={() => setLogoBase64("")} className="ml-auto text-xs font-bold text-red-600">Remove</button>
                </div>
              )}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-purple-100 bg-white p-3">
                <input type="checkbox" checked={showWatermark} onChange={(e) => setShowWatermark(e.target.checked)} className="h-5 w-5 accent-purple-900" />
                <span className="text-xs font-black text-gray-700">Watermark</span>
              </label>
              {showWatermark && <input type="text" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)} className="w-full rounded-2xl border border-purple-100 bg-white px-4 py-2 text-xs font-bold outline-none" />}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-purple-100 bg-white p-3">
                <input type="checkbox" checked={showQR} onChange={(e) => setShowQR(e.target.checked)} className="h-5 w-5 accent-purple-900" />
                <span className="text-xs font-black text-gray-700">QR Code</span>
              </label>
              {showQR && <input type="text" value={qrValue} onChange={(e) => setQrValue(e.target.value)} className="w-full rounded-2xl border border-purple-100 bg-white px-4 py-2 text-xs font-bold outline-none" />}
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-black text-gray-700">📛 Brand Name</label>
              <input type="text" value={brandName} onChange={(e) => setBrandName(e.target.value)} className="w-full rounded-2xl border border-purple-100 bg-white px-4 py-2 text-xs font-bold outline-none" />
            </div>

            <div className="mt-6 rounded-3xl bg-purple-50 p-4">
              <p className="text-sm font-black text-purple-950">📄 Pages: {pages.length} | 📦 Blocks: {parsed.blocks.length}</p>
            </div>
          </section>

          <section className="min-w-0 rounded-[2rem] border border-purple-100 bg-white p-4 shadow-xl">
            <div className="mb-4">
              <h2 className="text-xl font-black text-purple-950">Live Preview</h2>
              <p className="text-xs font-bold text-gray-500">{pages.length} page(s) – footer ke upar clear gap।</p>
            </div>
            <div className="max-h-[82vh] overflow-auto rounded-3xl bg-gray-100 p-4">
              <div ref={previewRef} className="mx-auto flex w-fit flex-col gap-8">
                {pages.map((pageBlocks, pageIndex) => (
                  <NotePage key={pageIndex} title={parsed.title} blocks={pageBlocks} pageNumber={pageIndex + 1} totalPages={pages.length} colors={colors} fontFamily={fontFamily} styleProps={styleProps} logoBase64={logoBase64} showWatermark={showWatermark} watermarkText={watermarkText} showQR={showQR} qrValue={qrValue} brandName={brandName} />
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function NotePage({
  title, blocks, pageNumber, totalPages, colors, fontFamily, styleProps, logoBase64, showWatermark, watermarkText, showQR, qrValue, brandName,
}: {
  title: string; blocks: Block[]; pageNumber: number; totalPages: number; colors: NoteTheme; fontFamily: string; styleProps: any; logoBase64: string; showWatermark: boolean; watermarkText: string; showQR: boolean; qrValue: string; brandName: string;
}) {
  return (
    <div data-note-page style={{ width: "794px", height: "1123px", background: colors.background, padding: "30px", boxSizing: "border-box", fontFamily, color: colors.text, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {showWatermark && watermarkText && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.04, pointerEvents: "none", zIndex: 1 }}>
          <span style={{ fontSize: "80px", fontWeight: 900, color: colors.headingColor, transform: "rotate(-30deg)", whiteSpace: "nowrap" }}>{watermarkText}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${colors.headerBg} 0%, ${adjustColor(colors.headerBg, -20)} 100%)`, borderRadius: styleProps.headerBorderRadius, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: styleProps.boxShadow, marginBottom: "16px", zIndex: 2, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {logoBase64 && <img src={logoBase64} alt="Logo" style={{ width: "36px", height: "36px", objectFit: "contain", borderRadius: "8px" }} />}
          <h1 style={{ margin: 0, fontSize: "26px", fontWeight: 900, color: colors.headerText }}>{title}</h1>
        </div>
        <span style={{ color: colors.headerText, fontSize: "11px", fontWeight: 700 }}>{brandName}</span>
      </div>

      {/* Content – safe zone guaranteed */}
      <div style={{ flex: 1, padding: `0 ${styleProps.notePadding} 20px ${styleProps.notePadding}`, zIndex: 2, position: "relative", overflow: "hidden" }}>
        {blocks.map((block, idx) => {
          switch (block.type) {
            case "h2":
              return <h2 key={idx} style={{ fontSize: "20px", fontWeight: 900, color: colors.headingColor, margin: "16px 0 6px 0", borderLeft: `4px solid ${colors.headingColor}`, paddingLeft: "10px" }}>{block.content}</h2>;
            case "h3":
              return <h3 key={idx} style={{ fontSize: "17px", fontWeight: 800, color: colors.headingColor, margin: "12px 0 4px 0" }}>{block.content}</h3>;
            case "bullet":
              return (
                <div key={idx} style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "3px", paddingLeft: "12px" }}>
                  <span style={{ color: colors.bulletColor, fontWeight: 900, fontSize: "15px", flexShrink: 0 }}>•</span>
                  <span style={{ fontWeight: 700, fontSize: "14px", color: colors.text, lineHeight: 1.45 }} dangerouslySetInnerHTML={{ __html: parseInline(block.content) }} />
                </div>
              );
            case "subbullet":
              return (
                <div key={idx} style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "2px", paddingLeft: "36px" }}>
                  <span style={{ color: colors.bulletColor, fontWeight: 700, flexShrink: 0 }}>◦</span>
                  <span style={{ fontWeight: 600, fontSize: "13px", color: colors.text, lineHeight: 1.45 }} dangerouslySetInnerHTML={{ __html: parseInline(block.content) }} />
                </div>
              );
            case "numbered":
              return (
                <div key={idx} style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "3px", paddingLeft: "12px" }}>
                  <span style={{ fontWeight: 900, color: colors.accent, minWidth: "20px", fontSize: "14px", flexShrink: 0 }}>{block.content.match(/^\d+\./)?.[0]}</span>
                  <span style={{ fontWeight: 700, fontSize: "14px", color: colors.text, lineHeight: 1.45 }} dangerouslySetInnerHTML={{ __html: parseInline(block.content.replace(/^\d+\.\s*/, "")) }} />
                </div>
              );
            case "quote":
              return (
                <div key={idx} style={{ background: colors.quoteBg, borderLeft: `4px solid ${colors.accent}`, padding: "10px 14px", borderRadius: "6px", margin: "12px 0", fontStyle: "italic", fontWeight: 500, fontSize: "13px", lineHeight: 1.5, color: colors.text }}>
                  {block.content}
                </div>
              );
            case "divider":
              return <hr key={idx} style={{ border: `1px dashed ${colors.border}`, margin: "14px 0" }} />;
            default:
              return <p key={idx} style={{ fontSize: "14px", lineHeight: 1.5, fontWeight: 500, margin: "5px 0", color: colors.text }}>{block.content}</p>;
          }
        })}
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "9px", fontWeight: 700, color: colors.headingColor, zIndex: 2, flexShrink: 0 }}>
        <span>{brandName}</span>
        <span>Smart Notes</span>
        <span>Page {pageNumber}/{totalPages}</span>
        {showQR && (
          <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=25x25&data=${encodeURIComponent(qrValue)}&margin=0`} alt="QR" style={{ width: "20px", height: "20px" }} crossOrigin="anonymous" />
            <span style={{ fontSize: "7px" }}>Scan</span>
          </div>
        )}
      </div>
    </div>
  );
}

function parseInline(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>");
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}