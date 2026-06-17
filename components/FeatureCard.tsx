import Link from "next/link";

type FeatureCardProps = {
  title: string;
  icon: string;
  href: string;
  desc: string;
};

export default function FeatureCard({ title, icon, href, desc }: FeatureCardProps) {
  return (
    <Link
      href={href}
      className="group bg-white rounded-3xl p-6 shadow-md border hover:shadow-2xl hover:-translate-y-1 transition"
    >
      <div className="text-4xl mb-4">{icon}</div>

      <h3 className="text-xl font-black mb-2 group-hover:text-blue-700">
        {title}
      </h3>

      <p className="text-gray-600 text-sm mb-4">
        {desc}
      </p>

      <span className="font-bold text-blue-600">
        Open Section →
      </span>
    </Link>
  );
}