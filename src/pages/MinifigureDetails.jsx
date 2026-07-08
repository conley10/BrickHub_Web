import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import { API_URL } from "../config";

const MinifigureDetails = () => {
  const { figNum } = useParams();

  const [figData, setFigData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMinifigure = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/minifig/${encodeURIComponent(figNum)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch minifigure details");
        }

        const data = await response.json();
        setFigData(data);
      } catch (err) {
        console.error(err);
        setError("Something went wrong while loading minifigure details.");
      } finally {
        setLoading(false);
      }
    };

    fetchMinifigure();
  }, [figNum]);

  return (
    <div className="w-full bg-[#f3f3f3] min-h-screen">
      <section className="w-full bg-red-600 border-b-2 border-black">
        <div className="max-w-[1200px] mx-auto px-6 py-20 text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-white mb-3">
            Minifigure Details
          </p>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white">
            LEGO Minifigure
          </h1>
        </div>
      </section>

      <section className="w-full py-16">
        <div className="max-w-[1100px] mx-auto px-6">
          {loading && (
            <div className="bg-white border-2 border-black rounded-2xl p-10 shadow-[4px_4px_0px_#000]">
              Loading minifigure details...
            </div>
          )}

          {error && (
            <div className="bg-white border-2 border-black rounded-2xl p-10 shadow-[4px_4px_0px_#000] text-red-600 font-semibold">
              {error}
            </div>
          )}

          {!loading && !error && figData && (
            <div className="bg-white border-2 border-black rounded-3xl p-8 md:p-10 shadow-[6px_6px_0px_#000] grid md:grid-cols-2 gap-10 items-start">
              <div className="flex justify-center">
                {figData.set_img_url && (
                  <img
                    src={figData.set_img_url}
                    alt={figData.name}
                    className="w-full max-w-[420px] object-contain"
                  />
                )}
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-red-600 mb-3">
                  {figData.fig_num}
                </p>

                <h2 className="text-4xl md:text-5xl font-extrabold text-black leading-tight">
                  {figData.name}
                </h2>

                <div className="mt-8 space-y-3 text-lg text-gray-700">
                  <p>
                    <span className="font-bold text-black">Minifigure Number:</span>{" "}
                    {figData.fig_num}
                  </p>
                </div>

                <div className="mt-10">
                  <Link
                    to={`/catalog/request?type=minifig&id=${encodeURIComponent(
                      figData.fig_num
                    )}&name=${encodeURIComponent(figData.name)}`}
                    className="inline-block bg-black text-white px-8 py-4 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-y-[-2px] transition"
                  >
                    Request this Minifigure
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MinifigureDetails;