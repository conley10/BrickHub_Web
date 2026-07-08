import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import Footer from "../components/Footer";

const SearchCatalog = () => {
    const [query, setQuery] = useState("");
    const [type, setType] = useState("sets");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!query.trim()) return;

        navigate(`/catalog/results?type=${type}&q=${encodeURIComponent(query)}`);
    };

    return (
        <div className="w-full bg-[#f3f3f3] min-h-screen">
            <section className="w-full bg-yellow-400 border-b-2 border-black">
                <div className="max-w-[1200px] mx-auto px-6 py-24 text-center">
                    <p className="text-sm font-bold uppercase tracking-wider text-black mb-4">
                        Brickhub Catalog
                    </p>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-black leading-tight">
                        Search for any LEGO
                        <br />
                        <span className="text-red-600"> Set or Minifigure </span>
                    </h1>

                    <p className="mt-6 text-lg text-black max-w-[720px] mx-auto">
                        Search the full Lego catalog and request a set or minifigure for us to source.
                    </p>
                </div>
            </section>

            <section className="w-full py-20">
                <div className="max-w-[900px] mx-auto px-6">
                    <div className="bg-white border-2 rounded-3xl p-8 md:pd-10 shadow-[6px_6px_0px_#000]">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-8">
                            Start Your Search
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold mb-2">
                                        Search Type
                                </label>

                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full rounded-xl border-2 bg-[#f3f3f3] px-4 py-4 outline-none font-semibold"
                                >
                                    <option value="sets"> Sets </option>
                                    <option value="minifigs"> Minifigs </option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-black mb-2">
                                    Search
                                </label>

                                <div className="relative">
                                    <Search 
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                                    />
                                    <input 
                                        type="text"
                                        placeholder="Try Batman, UCS Falcon, Clone Trooper..."
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        className="w-full rounded-xl border-2 bg-[#f3f3f3] pl-11 pr-4 py-4 outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-black text-white py-4 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-y-[-2px] transition cursor-pointer"
                            >
                                Search Catalog
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default SearchCatalog;