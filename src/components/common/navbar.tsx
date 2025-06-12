import { AiFillHome } from "react-icons/ai";
import { GiFire } from "react-icons/gi";
import { MdCheckCircle } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import React from "react";

function Navbar() {
  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: <AiFillHome className="mr-2" />,
      active: true,
    },
    {
      name: "Streaks",
      href: "/streaks",
      icon: <GiFire className="mr-2" />,
      active: false,
    },
    {
      name: "Commitments",
      href: "/commitments",
      icon: <MdCheckCircle className="mr-2" />,
      active: false,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: <FaUser className="mr-2" />,
      active: false,
    },
  ];
  return (
    <nav className="p-2 flex items-center justify-center">
      <div className="flex items-center justify-center gap-22 border p-2 border-white rounded-lg">
        <div className="text-white text-lg font-semibold">BetterAuth</div>
        <ul className="flex gap-16">
          {navItems.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className={`text-white flex items-center  justify-center  hover:text-gray-300 ${
                  item.active ? "font-bold" : ""
                }`}
              >
                {item.icon}
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
