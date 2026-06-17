import Link from "next/link";

export default function BackButton() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 mb-6 text-blue-700 font-bold hover:underline"
    >
      ← Back to Home
    </Link>
  );
}