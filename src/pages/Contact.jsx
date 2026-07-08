import React, { useState } from "react";
import { Mail, MapPin, Clock } from "lucide-react";
import Footer from "../components/Footer";
import { API_URL } from "../config";

const contactItems = [
    {
        id: 1, 
        icon: <Mail size={22}/>,
        label: "EMAIL",
        value: "hello@brickhub.com",
    },
    {
        id: 2, 
        icon: <MapPin size={22}/>,
        label: "LOCATION",
        value: "Sydney, Australia",
    },
    {
        id: 3, 
        icon: <Clock size={22}/>,
        label: "RESPONSE TIME",
        value: "Within 24 hours",
    },
];

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ state: "idle", text: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: "loading", text: "" });

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setStatus({ state: "success", text: data.message || "Message sent!" });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Contact form error:", error);
      setStatus({
        state: "error",
        text: "Something went wrong while sending your message. Please try again.",
      });
    }
  };

  return (
    <div className="w-full bg-[#f3f3f3]">
        <section className="w-full bg-yellow-400 border-b-2 border-black">
            <div className="max-w-[1200px] mx-auto px-6 py-24 text-center">
                <h1 className="text-5xl md:text-7xl font-extrabold text-black">
                    Get In Touch
                </h1>
                <p className="mt-6 text-lg md:text-xl text-black max-w-[700px] mx-auto">
                    Have a question? We'd love to hear from you.
                </p>
            </div>
        </section>

        <section className="w-full py-20">
            <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-2 gap-16 items-start">
                <div>
                    <h2 className="text-4xl font-extrabold text-black mb-10">
                        Contact info
                    </h2>

                    <div className="space-y-6">
                        {contactItems.map((item) => (
                            <div key={item.id} className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-yellow-400 border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center text-black shrink-0">
                                    {item.icon}
                                </div>

                                <div>
                                    <p className="text-sm font-bold tracking-wider text-gray-500 uppercase">
                                        {item.label}
                                    </p>
                                    <p className="text-2xl font-bold text-black mt-1">
                                        {item.value}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border-2 border-black rounded-3xl p-8 shadow-[6px_6px_0px_#000]">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-black mb-2">
                                    Name
                            </label>
                            <input 
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your name"
                                className="w-full rounded-2xl border-2 border-black bg-[#f3f3f3] px-4 py-4 outline-none text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-black mb-2">
                                    Email
                            </label>
                            <input 
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your@example.com"
                                className="w-full rounded-xl border-2 border-black bg-[#f3f3f3] px-4 py-4 outline-none text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-black mb-2">
                                    Message
                            </label>
                            <textarea
                                name="message"
                                required
                                rows="6"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="How can we help?"
                                className="w-full rounded-xl border-2 border-black bg-[#f3f3f3] px-4 py-4 outline-none text-sm"
                            >
                            </textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={status.state === "loading"}
                            className="w-full bg-black text-white py-4 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-y-[-2px] transition cursor-pointer disabled:opacity-60"
                        >
                            {status.state === "loading" ? "Sending..." : "Send Message"}
                        </button>

                        {status.state === "success" && (
                            <p className="text-green-600 font-semibold">{status.text}</p>
                        )}
                        {status.state === "error" && (
                            <p className="text-red-600 font-semibold">{status.text}</p>
                        )}
                    </form>
                </div>
            </div>
        </section>
    <Footer />
    </div>
  );
};

export default Contact;
