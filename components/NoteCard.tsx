import Link from "next/link";

type NoteCardProps = {
  title: string;
  description: string;
  classNameValue: string;
  subject: string;
  chapter: string;
  topic: string;
  pdfUrl: string;
  tag: string;
};

export default function NoteCard({
  title,
  description,
  classNameValue,
  subject,
  chapter,
  topic,
  pdfUrl,
  tag,
}: NoteCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-md border p-6 hover:shadow-2xl hover:-translate-y-1 transition">
      <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold mb-4">
        {tag}
      </span>

      <h2 className="text-xl font-black mb-2">{title}</h2>

      <p className="text-gray-600 text-sm mb-4">
        {description}
      </p>

      <div className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-700 space-y-1 mb-5">
        <p><b>Class:</b> {classNameValue}</p>
        <p><b>Subject:</b> {subject}</p>
        <p><b>Chapter:</b> {chapter}</p>
        <p><b>Topic:</b> {topic}</p>
      </div>

      <div className="flex gap-3">
        <Link
          href={pdfUrl}
          target="_blank"
          className="flex-1 text-center bg-blue-700 text-white px-4 py-3 rounded-xl font-bold hover:bg-blue-800 transition"
        >
          View PDF
        </Link>

        <a
          href={pdfUrl}
          download
          className="flex-1 text-center bg-green-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-green-700 transition"
        >
          Download
        </a>
      </div>
    </div>
  );
}