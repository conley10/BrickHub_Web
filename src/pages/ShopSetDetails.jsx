import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { API_URL } from "../config";
import { imageMap } from "../imageMap";

const ShopSetDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { addToCart } = useCart();

    const [set, setSet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSet = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(`${API_URL}/api/products/${id}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch set");
                }

                const data = await response.json();
                setSet(data);
            } catch (err) {
                console.error(err);
                setError("Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        fetchSet();
    }, [id]);

    if (loading) {
        return <div className="p-10">Loading...</div>;
    }

    if (error) {
        return <div className="p-10 text-red-600 font-semibold">{error}</div>;
    }

    if(!set) {
        return <div className="p-10">
            Set not found
        </div>
    }

    const isSoldOut = set.stock === 0;

    const conditionTextColors = {
        New: "text-green-600",
        Used: "text-blue-600",
        Retired: "text-red-600",
    };

  return (
    <div className="bg-[#f3f3f3] min-h-screen">
        <div className="pt-28 max-w-[1200px] mx-auto px-6">
            <Link 
                to="/sets"
                className="text-gray-600 font-semibold mb-6 inline-block"
            >
                ← Back
            </Link>

            <div className="mb-10 text-center">
                <p className="text-lg font-bold uppercase tracking-wider text-gray-500">
                    {set.theme}
                </p>
                <h1 className={`text-5xl md:text-6xl font-extrabold mt-2 ${
                    conditionTextColors[set.condition] || "text-black"
                }`}>
                    {set.name}
                </h1>

                <span
                    className={`inline-block mt-4 px-4 py-1 rounded-full text-sm font-bold ${
                        set.condition === "New"
                        ? "bg-green-600 text-white"
                        : set.condition === "Used"
                        ? "bg-blue-600 text-white"
                        : set.condition === "Retired"
                        ? "bg-red-600 text-white"
                        : "bg-gray-600 text-white"
                    }`}
                >
                    {set.condition}
                </span>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                <div className="bg-white border-2 rounded-2xl p-6 shadow-[6px_6px_0px_#000] mb-5">
                    <img
                        src={imageMap.set[set.image_key]}
                        alt={set.name}
                        className="w-full object-contain"
                    />
                </div>

                <div>
                    <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-bold">
                        {set.condition}
                    </span>
                    <h1 className="text-4xl font-extrabold mt-4">
                        {set.name}
                    </h1>
                    <p className="text-3xl text-red-600 font-extrabold mt-2">
                        ${set.price.toFixed(2)}
                    </p>

                    <div className="grid grid-cols-3 gap-4 mt-6">
                        <div className="border-2 p-4 text-center rounded-xl">
                            <p className="font-bold">
                                {set.pieces || "N/A"}
                            </p>
                            <p className="text-sm text-gray-500">
                                PIECES
                            </p>
                        </div>

                        <div className="border-2 p-4 text-center rounded-xl">
                            <p className="font-bold">
                                {set.theme}
                            </p>
                            <p className="text-sm text-gray-500">
                                THEME
                            </p>
                        </div>

                        <div className="border-2 p-4 text-center rounded-xl">
                            <p className="font-bold">
                                {isSoldOut ? "0" : set.stock}
                            </p>
                            <p className="text-sm text-gray-500">
                                STOCK
                            </p>
                        </div>
                    </div>

                    <p className="mt-4 text-gray-600">
                        SKU: {set.sku}
                    </p>

                    <div className="mt-6 flex flex-col gap-4 mb-10">
                        <button
                            disabled={isSoldOut}
                            onClick={() => {
                                addToCart({ ...set, image: imageMap.set[set.image_key] });
                                navigate("/checkout");
                            }}
                            className={`py-4 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_#000] ${
                                isSoldOut
                                ? "bg-gray-300 text-gray-600"
                                : "bg-red-600 text-white hover:translate-y-[-2px]"
                            }`}
                        >
                            {isSoldOut ? "Sold Out" : `Buy Now - $${set.price}`}
                        </button>

                        <button
                            onClick={() => addToCart({ ...set, image: imageMap.set[set.image_key] })}
                            disabled={isSoldOut}
                            className={`py-4 rounded-xl font-bold border-2 border-black ${
                                isSoldOut
                                ? "bg-gray-300 text-gray-600"
                                : "bg-black text-white hover:opacity-80"
                            }`}
                        >
                            Add to Cart
                        </button>
                    </div>

                </div>
            </div>

        </div>
      <Footer />
    </div>
  );
};

export default ShopSetDetails;