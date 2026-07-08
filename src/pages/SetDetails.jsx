import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../components/Footer";
import { API_URL } from "../config";

const SetDetails = () => {
  const { setNum } = useParams();

  const [setData, setSetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSet = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/set/${encodeURIComponent(setNum)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch set details");
        }

        const data = await response.json();
        setSetData(data);
      } catch (err) {
        console.error(err);
        setError("Something went wrong while loading set details.");
      } finally {
        setLoading(false);
      }
    };

    fetchSet();
  }, [setNum]);


  return (
    <div className="w-full bg-[#f3f3f3] min-h-screen">
        <section className="w-full bg-yellow-400 border-b-2 border-black">
            <div className="max-w-[1200px] mx-auto px-6 py-20 text-center">
                <p className="text-sm font-bold uppercase tracking-wider text-black mb-3">
                    Set Details
                </p>
                <h1 className="text-5xl md:text-6xl font-extrabold text-black">
                    LEGO Set
                </h1>
            </div>
        </section>

        <section className="w-full py-16">
            <div className="max-w-[1100px] mx-auto px-6">
                {loading && (
                    <div className="bg-white border-2 border-black rounded-2xl p-10 shadow-[4px_4px_0px_#000]">
                        Loading set details...
                    </div>
                )}

                {error && (
                    <div className="bg-white border-2 border-black rounded-2xl p-10 shadow-[4px_4px_0px_#000] text-red-600 font-semibold">
                        {error}
                    </div>
                )}

                {!loading && !error && setData && (
                    <div className="bg-white border-2 border-black rounded-3xl p-8 md:p-10 shadow-[6px_6px_0px_#000] grid md:grid-cols-2 gap-10 items-start">
                        <div className="flex justify-center">
                            {setData.set_img_url && (
                                <img 
                                    src={setData.set_img_url}
                                    alt={setData.name}
                                    className="w-full max-w-[420px] object-contain"
                                />
                            )}
                        </div>

                        <div>
                            <p className="text-sm font-bold uppercase tracking-wider text-red-600 mb-3">
                                {setData.set_num}
                            </p>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-black leading-tight">
                                {setData.name}
                            </h2>

                            <div className="mt-8 space-y-3 text-lg text-gray-700">
                                <p>
                                    <span className="font-bold text-black">
                                        Year:
                                    </span>
                                    {setData.year}
                                </p>
                                <p>
                                    <span className="font-bold text-black">
                                        Parts:
                                    </span>
                                    {setData.num_parts}
                                </p>
                                <p>
                                    <span className="font-bold text-black">
                                        Theme ID:
                                    </span>
                                    {setData.theme_id}
                                </p>
                            </div>

                            <div>
                                <Link
                                    to={`/catalog/request?type=set&id=${encodeURIComponent(
                                        setData.set_num
                                    )}&name=${encodeURIComponent(setData.name)}`}
                                    className="inline-block bg-black text-white px-8 py-4 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-y-[-2px] transition"
                                >
                                    Request this Set
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

export default SetDetails;