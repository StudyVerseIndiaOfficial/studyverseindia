type VideoCardProps = {
  title: string;
  classNameValue: string;
  subject: string;
  chapter: string;
  topic: string;
  youtubeId: string;
};

export default function VideoCard({
  title,
  classNameValue,
  subject,
  chapter,
  topic,
  youtubeId,
}: VideoCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-md border overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition">
      <img
        src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
        alt={title}
        className="w-full h-52 object-cover"
      />

      <div className="p-5">
        <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold mb-3">
          {classNameValue}
        </span>

        <h2 className="text-xl font-black mb-3">{title}</h2>

        <p className="text-sm text-gray-600 mb-1">
          <b>Subject:</b> {subject}
        </p>

        <p className="text-sm text-gray-600 mb-1">
          <b>Chapter:</b> {chapter}
        </p>

        <p className="text-sm text-gray-600 mb-4">
          <b>Topic:</b> {topic}
        </p>

        <a
          href={`https://www.youtube.com/watch?v=${youtubeId}`}
          target="_blank"
          className="block text-center bg-red-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-red-700 transition"
        >
          ▶ Watch Video
        </a>
      </div>
    </div>
  );
}