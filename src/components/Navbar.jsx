import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { ShoppingCart } from "lucide-react";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const location = useLocation();

  const handleNav = () => {
    setNav(!nav);
  };

  const closeNav = () => {
    setNav(false);
  };

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "SETS", path: "/sets" },
    { name: "MINIFIGURES", path: "/minifigures" },
    { name: "ABOUT", path: "/about" },
    { name: "SOURCE A SET", path: "/catalog/search" }, // ✅ NEW
    { name: "CONTACT", path: "/contact" },
  ];

  return (
    <>
      {/* Top Navbar */}
      <div className="w-full bg-[#f3f3f3] fixed top-0 left-0 z-50 shadow-md">
        <div className="flex items-center justify-between px-6 md:px-12 py-6">
          
          {/* Left Side */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleNav}
              className="text-black cursor-pointer"
              aria-label={nav ? "Close menu" : "Open menu"}
              aria-expanded={nav}
            >
              {nav ? <AiOutlineClose size={30} /> : <AiOutlineMenu size={30} />}
            </button>

            <Link to="/" className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-red-600"></div>
              <h1 className="text-3xl font-extrabold">
                <span className="text-black">BRICK</span>
                <span className="text-red-600">HUB</span>
              </h1>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex gap-8 text-black font-semibold">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`hover:text-red-600 transition ${
                      location.pathname === link.path
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="text-black hover:text-red-600 transition"
            >
              <ShoppingCart size={26} />
            </Link>
          </div>
        </div>

        <div className="h-[2px] w-full bg-yellow-500"></div>
      </div>

      {/* Mobile Slide-out Menu */}
      <div
        className={
          nav
            ? "fixed top-0 left-0 w-[260px] h-full bg-white border-r shadow-lg ease-in-out duration-300 z-50"
            : "fixed top-0 left-[-100%] w-[260px] h-full bg-white border-r shadow-lg ease-in-out duration-300 z-50"
        }
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-black">MENU</h2>
          <button
            onClick={handleNav}
            className="text-black cursor-pointer"
            aria-label="Close menu"
          >
            <AiOutlineClose size={26} />
          </button>
        </div>

        <ul className="p-6 text-black font-semibold">
          {navLinks.map((link) => (
            <li key={link.name} className="p-4 border-b">
              <Link
                to={link.path}
                onClick={closeNav}
                className={`block hover:text-red-600 transition ${
                  location.pathname === link.path
                    ? "text-red-600"
                    : ""
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}

          {/* Mobile Cart */}
          <li className="p-4 border-b">
            <Link
              to="/cart"
              onClick={closeNav}
              className="flex items-center gap-3 hover:text-red-600"
            >
              <ShoppingCart size={22} />
              CART
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;