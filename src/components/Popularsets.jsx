import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config";
import { imageMap } from "../imageMap";

const conditionColors = {
  New: "bg-green-600",
  Used: "bg-blue-600",
  Retired: "bg-red-600",
  Limited: "bg-blue-600",
  Popular: "bg-yellow-600",
  Exclusive: "bg-purple-600",
};

const Popularsets = () => {
  const [popularSets, setPopularSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        setPopularSets(data.slice(0, 6));
      } catch (err) {
        console.error(err);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchSets();
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-[#e9eaec] py-20 text-center">
        Loading...
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-[#e9eaec] py-20 text-center text-red-600">
        {error}
      </section>
    );
  }

  return (
    <section className="w-full bg-[#e9eaec] py-20">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <p className="text-red-500 text-sm font-semibold uppercase tracking-wider">
            Favourite Collection
          </p>

          <h2 className="text-4xl font-extrabold text-black mt-2">
            Popular Sets
          </h2>

          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Explore our curated selection of popular LEGO sets, featuring iconic themes and fan
            favorites that inspire creativity and fun for builders of all ages.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularSets.map((set) => (
            <Link
              to={`/sets/${set.id}`}
              key={set.id}
              className="block bg-white border-2 border-black hover:-translate-y-2 transition rounded-2xl overflow-hidden shadow-[6px_6px_0px_#000] hover:shadow-[10px_10px_0px_#000]"
            >
              <div className="p-4">
                <span
                  className={`inline-block text-white text-xs font-bold px-3 py-1 rounded-full ${
                    conditionColors[set.condition] || "bg-gray-600"
                  }`}
                >
                  {set.condition}
                </span>

                <div className="mt-4 flex justify-center">
                  <img
                    src={imageMap.set[set.image_key]}
                    alt={set.name}
                    loading="lazy"
                    className="h-48 object-contain"
                  />
                </div>

                <div className="mt-4">
                  <p className="text-gray-500 text-sm">{set.theme}</p>

                  <h3 className="text-lg font-bold text-black mt-1">
                    {set.name}
                  </h3>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-red-600 font-bold">
                      ${Number(set.price).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4">
                <div className="w-full bg-black cursor-pointer text-white py-3 rounded-lg font-semibold hover:opacity-70 transition text-center">
                  View Details
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Popularsets;