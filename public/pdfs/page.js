export default function PdfPage() {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Study Verse PDFs</h1>

      <a
        href="/pdfs/Study_Verse_Bihar_Stone_Age.pdf"
        target="_blank"
        style={{
          display: "inline-block",
          marginTop: "20px",
          padding: "12px 20px",
          background: "black",
          color: "white",
          borderRadius: "8px",
          textDecoration: "none",
        }}
      >
        📄 Open Bihar Stone Age PDF
      </a>
    </div>
  );
}