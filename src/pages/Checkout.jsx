import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CreditCard, Truck, User, CheckCircle, Check } from "lucide-react";
import { useCart } from "../context/CartContext";
import Footer from "../components/Footer";
import { API_URL } from "../config";

const Checkout = () => {
    const { cartItems, clearCart } = useCart();
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
    );

    const shipping = subtotal > 75 || subtotal === 0 ? 0 : 6.99;
    const total = subtotal + shipping;

    const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const orderData = {
        customerName:
            formData.get("firstName") + " " + formData.get("lastName"),

        email: formData.get("email"),
        phone: formData.get("phone"),
        address: formData.get("address1"),
        city: formData.get("city"),
        postcode: formData.get("postcode"),
        country: formData.get("country"),

        cartItems,
        subtotal,
        shipping,
        total,
    };

    setSubmitting(true);
    setError("");

    try {
        const response = await fetch(`${API_URL}/api/orders`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to place order");
        }

        clearCart();
        setSubmitted(true);
    } catch (err) {
        console.error("Checkout error:", err);
        setError(
            "Something went wrong while placing your order. Please try again."
        );
    } finally {
        setSubmitting(false);
    }
};



    if (cartItems.length === 0) {
        return (
            <div className="bg-[#f3f3f3] min-h-screen">
                <section className="bg-yellow-400 border-b-2 border-black">
                    <div className="max-w-[1200px] mx-auto px-6 py-16 text-center">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-black">
                            Checkout
                        </h1>
                    </div>
                </section>

                <section className="max-w-[800px] mx-auto px-6 py-20 text-center">
                    <div className="bg-white border-2 border-black rounded-3xl p-12 shadow-[6px_6px_0px_#000]">
                        <h2 className="text-4xl font-extrabold">
                            Your cart is empty
                        </h2>
                        <p className="text-gray-600 mt-4">
                            Add some sets before checking out
                        </p>

                        <Link
                            to="/sets"
                            className="inline-block mt-8 bg-red-600 text-white px-8 py-4 rounded-full font-bold border-2 shadow-[4px_4px_0px_#000] hover:translate-y-[-2px] transition"
                        >
                            Browse Sets
                        </Link>
                    </div>
                </section>
                <Footer />
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="bg-[#f3f3f3] min-h-screen">
                <section className="max-w-[800px] mx-auto px-6 py-24 text-center">
                    <div className="bg-white border-2 rounded-3xl p-12 shadow-[6px_6px_0px_#000]">
                        <CheckCircle 
                            size={72}
                            className="mx-auto text-green-600 mb-6"
                        />

                        <h1 className="text-5xl font-extrabold">
                            Order request sent!
                        </h1>
                        <p className="text-gray-600 mt-4 text-lg">
                            This is a demo checkout. Your order details can later be connected
                            to email, Stripe, Firebase, or Supabase.
                        </p>
                        <Link
                            to="/"
                            className="inline-block mt-8 bg-black text-white px-8 py-4 rounded-full font-bold border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-y-[-2px] transition"
                        >
                            Back Home
                        </Link>
                    </div>
                </section>
                <Footer />
            </div>
        );
    }

    return (
        <div className="bg-[#f3f3f3] min-h-screen">
            <section className="bg-yellow-400 border-b-2">
                <div className="max-w-[1200px] mx-auto px-6 py-16 text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold">
                        Checkout
                    </h1>
                    <p className="mt-4 text-lg">
                        Complete your details below.
                    </p>
                </div>
            </section>

            <section className="max-w-[1200px] mx-auto px-6 py-16">
                <div className="grid lg:grid-cols-[1fr_380px] gap-8">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white border-2 rounded-3xl p-8 shadow-[6px_6px_0px_#000] space-y-8"
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <User 
                                    className="text-red-600"
                                />
                                <h2 className="text-3xl font-extrabold">
                                    Customer Details
                                </h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                                <input 
                                    required
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    className="border-2 rounded-xl px-4 py-4 outline-none bg-[#f3f3f3]"
                                />

                                <input 
                                    required
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    className="border-2 rounded-xl px-4 py-4 outline-none bg-[#f3f3f3]"
                                />

                                <input
                                    required
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    className="border-2 rounded-xl px-4 py-4 outline-none bg-[#f3f3f3]"
                                />

                                <input
                                    required
                                    type="tel"
                                    name="phone"
                                    placeholder="Phone Number"
                                    className="border-2 rounded-xl px-4 py-4 outline-none bg-[#f3f3f3]"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <Truck 
                                    className="text-red-600"
                                />
                                <h2 className="text-3xl font-extrabold text-black">
                                    Shipping Address
                                </h2>
                            </div>

                            <div className="grid md:grid-cols-2 gap-5">
                                <input 
                                    required
                                    type="text"
                                    name="address1"
                                    placeholder="Address line 1"
                                    className="border-2 rounded-xl px-4 py-4 outline-none bg-[#f3f3f3]"
                                />

                                <input 
                                    type="text"
                                    placeholder="Address line 2 optional"
                                    className="border-2 rounded-xl px-4 py-4 outline-none bg-[#f3f3f3]"
                                />

                                <input 
                                    required
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    className="border-2 rounded-xl px-4 py-4 outline-none bg-[#f3f3f3]"
                                />

                                <input 
                                    required
                                    type="text"
                                    name="postcode"
                                    placeholder="Postcode"
                                    className="border-2 rounded-xl px-4 py-4 outline-none bg-[#f3f3f3]"
                                />

                                <input 
                                    required
                                    type="text"
                                    name="country"
                                    placeholder="Country"
                                    className="md:col-span-2 border-2 border-black rounded-xl px-4 py-4 outline-none bg-[#f3f3f3]"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <CreditCard 
                                    className="text-red-600"
                                />
                                <h2 className="text-3xl font-extrabold text-black">
                                    Payment
                                </h2>
                            </div>

                            <div className="bg-yellow-100 border-2 border-black rounded-2xl p-5">
                                <p className="font-bold">
                                    Demo payment only
                                </p>
                                <p className="text-gray-700 mt-1">
                                    No real payment will be taken right now 
                                </p>
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-600 font-semibold">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-red-600 text-white py-4 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-y-[-2px] transition cursor-pointer disabled:opacity-60"
                        >
                            {submitting ? "Placing Order..." : "Place Order Request"}
                        </button>
                    </form>

                    <aside className="bg-white border-2 border-black rounded-3xl p-6 shadow-[6px_6px_0px_#000] h-fit">
                        <h2 className="text-3xl font-extrabold mb-6">
                            Order Summary
                        </h2>

                        <div>
                            {cartItems.map((item) => (
                                <div
                                    key={item.id} 
                                    className="flex gap-4"
                                >
                                    <img 
                                        src={item.image}
                                        alt={item.name}
                                        className="w-20 h-20 object-contain bg-[#f3f3f3] border-2 border-black rounded-xl p-2"
                                    />

                                    <div className="flex-1">
                                        <h3 className="font-bold">
                                            {item.name}
                                        </h3>
                                        <p className="font-bold text-gray-600">
                                            Qty: {item.quantity}
                                        </p>
                                        <p className="font-bold text-red-600">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t-2 border-black mt-6 pt-6 space-y-3">
                            <div className="flex justify-between">
                                <span>
                                    Subtotal
                                </span>
                                <span className="font-bold">
                                    ${subtotal.toFixed(2)}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>
                                    Shipping
                                </span>
                                <span className="font-bold">
                                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                                </span>
                            </div>

                            <div className="flex justify-between text-xl pt-3 border-t-2">
                                <span className="font-extrabold">
                                    Total
                                </span>
                                <span className="font-extrabold text-red-600">
                                    ${total.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <Link
                            to="/cart"
                            className="block text-center mt-6 bg-black text-white py-4 rounded-xl font-bold border-2 border-black hover:opacity-80 transition"
                        >
                            Back to Cart
                        </Link>
                    </aside>
                </div>
            </section>
        <Footer />
        </div>
    );
 };

export default Checkout;