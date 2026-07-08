import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import { API_URL } from "../config";

const SearchResults = () => {
    const [params] = useSearchParams();
    const type = params.get("type") || "sets";
    const q = params.get("q") || "";

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/api/search?type=${encodeURIComponent(type)}&q=${encodeURIComponent(q)}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch search results");
                }

                const data = await response.json();
                setResults(data.results || []);
                } catch (err) {
                console.error(err);
                setError("Something went wrong while loading results.");
                } finally {
                setLoading(false);
                }
            };

            if (q) {
            fetchResults();
            } else {
            setLoading(false);
            }
        }, [type, q]);

  return (
    <div className="w-full bg-[#f3f3f3] min-h-screen">
        <section className="w-full bg-red-600 border-b-2 border-black">
            <div className="max-w-[1200] mx-auto px-6 py-20 text-center">
                <p className="text-sm font-bold uppercase tracking-wider text-white mb-3">
                    Search Results 
                </p>
                <h1 className="text-5xl md:text-6xl font-extrabold text-white">
                    Results for "{q}"
                </h1>
                <p className="mt-4 text-white text-lg">
                    Showing {type == "sets" ? "sets" : "minifigures"}
                </p>
            </div>
        </section>
        
        <section className="w-full py-16">
            <div className="max-w-[1200px] mx-auto px-6">
                {loading && (
                    <div className="bg-white border-2 border-black rounded-2xl p-10 shadow-[4px_4px_0px_#000]">
                        <p className="text-lg font-semibold text-black">
                            Loading results...
                        </p>
                    </div>
                )}

                {error && (
                    <div className="bg-white border-2 border-black rounded-2xl p-10 shadow-[4px_4px_0px_#000]">
                        <p className="text-lg font-semibold text-red-600">
                            {error}
                        </p>
                    </div>
                )}

                {!loading && !error && results.length === 0 && (
                    <div className="bg-white border-2 border-black rounded-2xl p-10 shadow-[4px_4px_0px_#000]">
                        <p className="text-lg font-semibold text-black">
                            NO results found.
                        </p>
                    </div>
                )}

                {!loading && !error && results.length > 0 && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {results.map((item) => (
                            <div
                                key={type === "sets" ? item.set_num : item.fig_num}
                                className="bg-white border-2 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_#000] hover:-translate-y-2 transition"
                            >
                                <div className="p-4">
                                    <div className="flex justify-center">
                                        {type === "sets" && item.set_img_url && (
                                            <img
                                                src={item.set_img_url}
                                                alt={item.name}
                                                loading="lazy"
                                                className="h-48 w-full object-contain"
                                            />
                                        )}

                                        {type === "minifigs" && item.set_img_url && (
                                            <img
                                                src={item.set_img_url}
                                                alt={item.name}
                                                loading="lazy"
                                                className="h-48 w-full object-contain"
                                            />
                                        )}
                                    </div>

                                    <div className="mt-4">
                                        <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                                            {type === "sets" ? item.set_num : item.fig_num}
                                        </p>
                                        <h3 className="text-lg font-extrabold text-black mt-2 min-h-[56px]">
                                            {item.name}
                                        </h3>

                                        {type === "sets" && (
                                            <p className="text-sm text-gray-600 mt-2">
                                                Year: {item.year}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-5">
                                        {type === "sets" ? (
                                            <Link 
                                                to={`/catalog/set/${item.set_num}`}
                                                className="block w-full text-center bg-black text-white py-3 rounded-xl font-bold border-2 border-black hover:opacity-80 transition"
                                            >
                                                View Set
                                            </Link>
                                        ):( 
                                            <Link
                                                to={`/catalog/minifig/${item.fig_num}`}
                                                className="block w-full text-center bg-black text-white py-3 rounded-xl font-bold border-2 border-black hover:opacity-80 transition"
                                            >
                                                View Minifigure                                             
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
        <Footer />
    </div>
  );
};

export default SearchResults;