type NewsCardProps = {
  title: string;
  description: string;
  image?: string;
  link?: string;
  type?: string;
  pinned?: boolean;
  buttonText?: string;
};

export default function NewsCard({
  title,
  description,
  image,
  link,
  type,
  pinned,
  buttonText = "Open",
}: NewsCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-md border overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition">
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-3">
          {type && (
            <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
              {type}
            </span>
          )}

          {pinned && (
            <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
              📌 Pinned
            </span>
          )}
        </div>

        <h2 className="text-xl font-black mb-2">
          {title}
        </h2>

        <p className="text-gray-600 text-sm mb-4">
          {description}
        </p>

        {link && (
          <a
            href={link}
            target={link.startsWith("http") ? "_blank" : "_self"}
            className="inline-block bg-blue-700 text-white px-4 py-3 rounded-xl font-bold hover:bg-blue-800 transition"
          >
            {buttonText}
          </a>
        )}
      </div>
    </div>
  );
}