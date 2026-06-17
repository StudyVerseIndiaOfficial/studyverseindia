type UpdateCardProps = {
  title: string;
  description: string;
  image: string;
  link: string;
  type: string;
  pinned?: boolean;
};

export default function UpdateCard({
  title,
  description,
  image,
  link,
  type,
  pinned,
}: UpdateCardProps) {
  return (
    <div className="group overflow-hidden rounded-3xl bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />

        <div className="absolute left-4 top-4 flex gap-2">
          <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow">
            {type}
          </span>

          {pinned && (
            <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow">
              📌 Pinned
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        <h2 className="mb-3 text-2xl font-bold text-gray-900">
          {title}
        </h2>

        <p className="mb-6 text-gray-600">
          {description}
        </p>

        <a
          href={link}
          className="inline-flex rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-5 py-3 font-semibold text-white shadow-md transition hover:scale-105"
        >
          Open Update →
        </a>
      </div>
    </div>
  );
}