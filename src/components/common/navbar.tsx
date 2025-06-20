"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Flame, CheckCircle, User } from "lucide-react";

function NavbarSimple() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Streaks", href: "/streaks", icon: Flame },
    { name: "Commitments", href: "/commitments", icon: CheckCircle },
    { name: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-white text-xl font-bold tracking-tight hover:text-blue-400 transition-colors"
          >
            OG-TODO
          </Link>

          {/* Navigation - Always visible, responsive sizing */}
          <div className="flex items-center space-x-1 bg-[#1a1a1a] border border-gray-700 rounded-xl p-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                        : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavbarSimple;
