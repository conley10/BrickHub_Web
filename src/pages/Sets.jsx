import React, { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import SetsCard from "../components/SetsCard";
import Footer from "../components/Footer";
import { API_URL } from "../config";

const Sets = () => {
  const [setsData, setSetsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("All");
  const [selectedTheme, setSelectedTheme] = useState("All");
  const [sortOption, setSortOption] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  useEffect(() => {
    const fetchSets = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/api/products?type=set`);

        if (!response.ok) {
          throw new Error("Failed to fetch sets");
        }

        const data = await response.json();
        setSetsData(data);
      } catch (err) {
        console.error(err);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchSets();
  }, []);

  const conditionFilters = ["All", "New", "Used", "Retired", "Limited", "Popular"];

  const themeFilters = ["All", ...new Set(setsData.map((set) => set.theme))];

  const filteredSets = useMemo(() => {
    let filtered = [...setsData];

    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();

      filtered = filtered.filter(
        (set) =>
          set.name.toLowerCase().includes(lowerSearch) ||
          set.theme.toLowerCase().includes(lowerSearch) ||
          (set.sku && set.sku.toLowerCase().includes(lowerSearch))
      );
    }

    if (selectedCondition !== "All") {
      filtered = filtered.filter((set) => set.condition === selectedCondition);
    }

    if (selectedTheme !== "All") {
      filtered = filtered.filter((set) => set.theme === selectedTheme);
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
  }, [searchTerm, selectedCondition, selectedTheme, sortOption]);

  // Reset to page 1 whenever the filters change. Adjusting state during
  // render (rather than in a useEffect) avoids an extra render pass.
  const filterKey = `${searchTerm}|${selectedCondition}|${selectedTheme}|${sortOption}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setCurrentPage(1);
  }

  const totalPages = Math.ceil(filteredSets.length / itemsPerPage);

  const paginatedSets = filteredSets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full bg-[#f3f3f3]">
      <section className="w-full bg-yellow-400 border-b-2 border-black">
        <div className="max-w-[1200px] mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-black">
            Sets
          </h1>

          <p className="mt-4 text-black text-base md:text-lg max-w-[620px] mx-auto leading-relaxed">
            New, used, and retired sets from every theme. Build your collection today.
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
                placeholder="Search by name, theme, or SKU..."
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
                Theme
              </p>

              <div className="flex flex-wrap gap-3">
                {themeFilters.map((item) => (
                  <button
                    key={item}
                    onClick={() => setSelectedTheme(item)}
                    className={`px-4 py-2 rounded-full border-2 border-black text-sm font-semibold transition cursor-pointer ${
                      selectedTheme === item
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
                  {filteredSets.length} set{filteredSets.length !== 1 ? "s" : ""} found
                </p>

                <p className="text-sm text-gray-600">
                  Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
                </p>
              </div>

              {filteredSets.length === 0 ? (
                <div className="bg-white border-2 border-black rounded-2xl p-10 text-center shadow-[4px_4px_0px_#000]">
                  <h3 className="text-2xl font-bold text-black">No sets found</h3>
                  <p className="text-gray-600 mt-2">
                    Try changing your search or filters.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {paginatedSets.map((set) => (
                      <SetsCard key={set.id} set={set} />
                    ))}
                  </div>

                  <div className="flex justify-center items-center gap-3 mt-10 flex-wrap">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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

export default Sets;