import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import MinifigureCard from "../components/MinifigureCard";
import Footer from "../components/Footer";
import { API_URL } from "../config";

const Minifigures = () => {
  const [minifiguresData, setMinifiguresData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("All");
  const [selectedSeries, setSelectedSeries] = useState("All");
  const [sortOption, setSortOption] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  useEffect(() => {
    const fetchMinifigures = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/products?type=minifig`);

        if (!response.ok) {
          throw new Error("Failed to fetch minifigures");
        }

        const data = await response.json();
        setMinifiguresData(data);
      } catch (err) {
        console.error(err);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchMinifigures();
  }, []);

  const conditionFilters = ["All", "New", "Used", "Retired"];

  const seriesFilters = [
    "All",
    ...new Set(minifiguresData.map((figure) => figure.series)),
  ];

  const filteredMinifigures = useMemo(() => {
    let filtered = [...minifiguresData];

    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();

      filtered = filtered.filter((figure) => {
        return (
          figure.name.toLowerCase().includes(lowerSearch) ||
          figure.series.toLowerCase().includes(lowerSearch) ||
          figure.sku.toLowerCase().includes(lowerSearch)
        );
      });
    }

    if (selectedCondition !== "All") {
      filtered = filtered.filter(
        (figure) => figure.condition === selectedCondition
      );
    }

    if (selectedSeries !== "All") {
      filtered = filtered.filter((figure) => figure.series === selectedSeries);
    }

    switch (sortOption) {
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "stock-high":
        filtered.sort((a, b) => b.stock - a.stock);
        break;
      case "stock-low":
        filtered.sort((a, b) => a.stock - b.stock);
        break;
      default:
        break;
    }

    return filtered;
  }, [searchTerm, selectedCondition, selectedSeries, sortOption]);

  // Reset to page 1 whenever the filters change. Adjusting state during
  // render (rather than in a useEffect) avoids an extra render pass.
  const filterKey = `${searchTerm}|${selectedCondition}|${selectedSeries}|${sortOption}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setCurrentPage(1);
  }

  const totalPages = Math.ceil(filteredMinifigures.length / itemsPerPage);

  const paginatedMinifigures = filteredMinifigures.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full bg-[#f3f3f3]">
      <section className="w-full bg-red-600 border-b-2 border-black">
        <div className="max-w-[1200px] mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white">
            Minifigures
          </h1>

          <p className="mt-4 text-white text-base md:text-lg max-w-[620px] mx-auto leading-relaxed">
            New, used, and retired minifigures from every theme. Build your
            collection today.
          </p>
        </div>
      </section>

      <section className="w-full border-t-2 border-black">
        <div className="max-w-[1200px] mx-auto px-6 py-10">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                placeholder="Search by name, series, or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border-2 border-black bg-white pl-11 pr-4 py-4 outline-none text-sm"
              />
            </div>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="rounded-xl border-2 border-black bg-white px-4 py-4 font-semibold text-sm min-w-[180px] outline-none"
            >
              <option value="default">Sort: Default</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
              <option value="stock-high">Stock: High to Low</option>
              <option value="stock-low">Stock: Low to High</option>
            </select>
          </div>

          <div className="mt-8 grid md:grid-cols-[180px_1fr] gap-8">
            <div>
              <p className="text-xs font-extrabold tracking-wider text-gray-600 uppercase mb-3">
                Condition
              </p>

              <div className="flex flex-wrap gap-3">
                {conditionFilters.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSelectedCondition(item)}
                    className={`px-4 py-2 rounded-full border-2 border-black text-sm font-semibold transition cursor-pointer ${
                      selectedCondition === item
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-black hover:text-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-extrabold tracking-wider text-gray-600 uppercase mb-3">
                Series
              </p>

              <div className="flex flex-wrap gap-3">
                {seriesFilters.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSelectedSeries(item)}
                    className={`px-4 py-2 rounded-full border-2 border-black text-sm font-semibold transition cursor-pointer ${
                      selectedSeries === item
                        ? "bg-black text-white"
                        : "bg-white text-black hover:bg-black hover:text-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full pb-20">
        <div className="max-w-[1200px] mx-auto px-6">
          {loading && (
            <div className="bg-white border-2 border-black rounded-2xl p-10 text-center shadow-[4px_4px_0px_#000]">
              Loading...
            </div>
          )}

          {!loading && error && (
            <div className="bg-white border-2 border-black rounded-2xl p-10 text-center shadow-[4px_4px_0px_#000] text-red-600 font-semibold">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <p className="text-sm text-gray-600">
                  {filteredMinifigures.length} minifigure
                  {filteredMinifigures.length !== 1 ? "s" : ""} found
                </p>

                <p className="text-sm text-gray-600">
                  Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
                </p>
              </div>

              {filteredMinifigures.length === 0 ? (
                <div className="bg-white border-2 border-black rounded-2xl p-10 text-center shadow-[4px_4px_0px_#000]">
                  <h3 className="text-2xl font-bold text-black">No minifigures found</h3>
                  <p className="text-gray-600 mt-2">
                    Try changing your search or filters.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {paginatedMinifigures.map((figure) => (
                      <MinifigureCard key={figure.id} figure={figure} />
                    ))}
                  </div>

                  <div className="flex justify-center items-center gap-3 mt-10 flex-wrap">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg border-2 border-black font-semibold ${
                        currentPage === 1
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-white text-black hover:bg-black hover:text-white cursor-pointer"
                      }`}
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                      (pageNumber) => (
                        <button
                          key={pageNumber}
                          onClick={() => setCurrentPage(pageNumber)}
                          className={`px-4 py-2 rounded-lg border-2 border-black font-semibold ${
                            currentPage === pageNumber
                              ? "bg-black text-white"
                              : "bg-white text-black hover:bg-black hover:text-white cursor-pointer"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      )
                    )}

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages || totalPages === 0}
                      className={`px-4 py-2 rounded-lg border-2 border-black font-semibold ${
                        currentPage === totalPages || totalPages === 0
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-white text-black hover:bg-black hover:text-white cursor-pointer"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Minifigures;