import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const NotFound = () => {
  return (
    <div className="bg-[#f3f3f3] min-h-screen">
      <section className="max-w-[800px] mx-auto px-6 py-24 text-center">
        <div className="bg-white border-2 border-black rounded-3xl p-12 shadow-[6px_6px_0px_#000]">
          <h1 className="text-6xl font-extrabold text-red-600">404</h1>
          <h2 className="text-3xl font-extrabold mt-4">Page not found</h2>
          <p className="text-gray-600 mt-4">
            The page you're looking for doesn't exist or has moved.
          </p>

          <Link
            to="/"
            className="inline-block mt-8 bg-black text-white px-8 py-4 rounded-full font-bold border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-y-[-2px] transition"
          >
            Back Home
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default NotFound;
