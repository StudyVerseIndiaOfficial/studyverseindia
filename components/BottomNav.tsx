"use client";

import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "Home",
    icon: "🏠",
    href: "/",
  },
  {
    label: "Notes",
    icon: "📚",
    href: "/notes",
  },
  {
    label: "Videos",
    icon: "🎥",
    href: "/videos",
  },
  {
    label: "Tests",
    icon: "📝",
    href: "/tests",
  },
  {
    label: "Alerts",
    icon: "🔔",
    href: "/notifications",
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-6px_20px_rgba(0,0,0,0.08)]">
      <div className="max-w-6xl mx-auto grid grid-cols-5">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 py-2 text-xs md:text-sm font-bold transition ${
                isActive
                  ? "text-blue-700 bg-blue-50"
                  : "text-gray-700 hover:text-blue-700"
              }`}
            >
              <span className={`text-2xl leading-none ${isActive ? "scale-110" : ""}`}>
                {item.icon}
              </span>
              <span className="leading-none">{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}