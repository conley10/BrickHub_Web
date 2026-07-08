import React from "react";
import { useCart } from "../context/CartContext";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { ShoppingCart, Trash2, PackageCheck } from "lucide-react";

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity } = useCart();

    const subtotal = cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const shipping = subtotal > 75 || subtotal === 0 ? 0 : 6.99;
    const total = subtotal + shipping;

    return (
    <div className="bg-[#f3f3f3] min-h-screen">
        <section className="bg-yellow-400 border-b-2 border-black">
            <div className="max-w-[1200px] mx-auto px-6 py-16 text-center">
                <h1 className="text-5xl md:text-6xl font-extrabold text-black">
                    Your Cart
                </h1>
                <p className="mt-4 text-lg">
                    Review your cart before checkout.
                </p>
            </div>
        </section>

        <section className="max-w-[1200px] mx-auto px-6 py-16">
            {cartItems.length === 0 ? (
                <div className="bg-white border-2 border-black rounded-3xl p-12 text-center shadow-[6px_6px_0px_#000] max-w-[700px] mx-auto">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 rounded-full bg-yellow-400 border-2 border-black flex items-center justify-center">
                            <ShoppingCart size={44} />
                        </div>
                    </div>

                    <h2 className="text-4xl font-extrabold">
                        Your cart is empty.
                    </h2>
                    <p className="text-gray-600 mt-4 text-lg">
                        Head back and find something you love.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                        <Link 
                            to="/sets"
                            className="bg-red-600 text-white px-8 py-4 rounded-full font-bold border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-y-[-2px] transition"
                        >
                            Browse Sets
                        </Link>
                        <Link
                            to="/minifigures"
                            className="bg-white text-black px-8 py-4 rounded-full font-bold border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-y-[-2px] transition"
                        >
                            Browse Minifigures
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid lg:grid-cols-[1fr_360px] gap-8">
                    <div className="space-y-6">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white border-2 border-black rounded-3xl p-5 md:p-6 shadow-[5px_5px_0px_#000] flex flex-col md:flex-row md:items-center gap-6"
                            >
                                <div className="bg-[#f3f3f3] border-2 rounded-2xl p-4 flex justify-center">
                                    <img 
                                        src={item.image}
                                        alt={item.name}
                                        className="w-32 h-32 object-contain"
                                    />
                                </div>

                                <div className="flex-1">
                                    <p className="text-xs font-bold uppercase tracking-wider text-red-600">
                                        {item.theme}
                                    </p>

                                    <h2 className="text-2xl font-extrabold text-black mt-1">
                                        {item.name}
                                    </h2>

                                    <p className="text-gray-600 mt-2">
                                        Condition:{" "}
                                        <span className="font-bold text-black">
                                            {item.condition}
                                        </span>
                                    </p>

                                    <div className="mt-2 flex items-center gap-3">
                                        <span className="text-gray-600">Quantity:</span>
                                        <div className="flex items-center gap-2 border-2 border-black rounded-full px-1">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                aria-label="Decrease quantity"
                                                className="w-7 h-7 flex items-center justify-center rounded-full font-bold hover:bg-black hover:text-white transition cursor-pointer"
                                            >
                                                -
                                            </button>
                                            <span className="font-bold text-black w-6 text-center">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                aria-label="Increase quantity"
                                                className="w-7 h-7 flex items-center justify-center rounded-full font-bold hover:bg-black hover:text-white transition cursor-pointer"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex md:flex-col item-center md:items-end justify-between gap-4">
                                    <p className="text-2xl font-extrabold text-red-600">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>

                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full font-bold hover:opacity-75 transition cursor-pointer"
                                    >
                                        <Trash2 size={16} />
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <aside className="bg-white border-2 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000] h-fit">
                        <div className="flex items-center gap-3 mb-6">
                            <PackageCheck 
                                size={28} 
                                className="text-red-600"
                            />
                            <h2 className="text-3xl font-extrabold text-black">
                                Summary
                            </h2>
                        </div>

                        <div className="space-y-4 text-gray-700">
                            <div className="flex justify-between">
                                <span>
                                    Subtotal:
                                </span>
                                <span className="font-bold">
                                    ${subtotal.toFixed(2)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>
                                    Shipping: 
                                </span>
                                <span className="font-bold text-black">
                                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                                </span>
                            </div>

                            <div className="border-t-2 border-black pt-4 flex justify-between text-xl">
                                <span className="font font-extrabold text-black">
                                    Total: 
                                </span>
                                <span className="font-extrabold text-red-600">
                                    ${total.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <Link
                            to="/checkout"
                            className="block text-center w-full mt-8 bg-red-600 text-white py-4 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-y-[-2px] transition cursor-pointer"
                            >
                            Checkout
                        </Link>

                        <Link
                            to="/sets"
                            className="block text-center mt-4 bg-black text-white py-4 rounded-xl font-bold border-2 border-black hover:opacity-80 transition"
                        >
                            Continue Shopping
                        </Link>
                    </aside>
                </div>
            )} 
        </section>


        <Footer />
    </div>
  );
};

export default Cart;