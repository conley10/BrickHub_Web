import React from "react";
import { useCart } from "../context/CartContext";
import { imageMap } from "../imageMap";

const conditionColors = {
    New: "bg-green-600",
    Used: "bg-blue-600",
    Retired: "bg-red-600",
};

const MinifigureCard = ({ figure }) => {
    const { addToCart } = useCart();
    const isSoldOut = figure.stock === 0;

    return (
        <div className="bg-white border-2 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_#000] transition hover:translate-y-2 hover:shadow-[8px_8px_0px_#000]">
            <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                    <span
                        className={`inline-block text-white text-xs font-bold px-3 py-1 rounded-full ${
                            conditionColors[figure.condition] || "bg-gray-600"
                        }`}
                    >
                        {figure.condition}
                    </span> 

                    {isSoldOut && (
                        <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-gray-300 text-gray-700">
                            Sold Out
                        </span>
                    )}
                </div>

                <div> 
                    <img
                        src={imageMap.minifig[figure.image_key]}
                        alt={figure.name}
                        loading="lazy"
                        className="h-56 w-full object-contain"
                    />
                </div>

                <div className="mt-4">
                    <p className="text-xs font-bold tracking-wide text-gray-500 uppercase">
                        {figure.series} 
                    </p>

                    <h3 className="text-lg font-bold text-black mt-2 min-h-[56px]"> 
                        {figure.name}
                    </h3>

                    <p className="text-sm text-gray-600 mt-2">
                        Stock: {figure.stock}
                    </p> 

                    <div className="mt-4 flex items-center justify-between gap-3">
                        <span className="text-2xl font-extrabold text-red-600">
                            ${figure.price.toFixed(2)} 
                        </span>

                        <button
                            disabled={isSoldOut}
                            onClick={() => addToCart({ ...figure, image: imageMap.minifig[figure.image_key] })}
                            className={`text-sm font-semibold px-4 py-2 rounded-full transition ${
                                isSoldOut
                                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                : "bg-black text-white hover:opacity-70 cursor-pointer"
                            }`}
                            >
                            {isSoldOut ? "Sold Out" : "Add To Cart"} 
                        </button> 
                    </div>
                </div>  
            </div> 
        </div> 
    );
};

export default MinifigureCard;