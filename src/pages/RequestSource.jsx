import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import { API_URL } from "../config";

const RequestSource = () => {
  const [params] = useSearchParams();

  const type = params.get("type") || "";
  const itemId = params.get("id") || "";
  const itemName = params.get("name") || "";

  const [itemData, setItemData] = useState(null);
  const [itemLoading, setItemLoading] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    budget: "",
    condition: "Any",
    notes: "",
  });

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      if (!type || !itemId) return;

      try {
        setItemLoading(true);

        let url = "";

        if (type === "set") {
          url = `${API_URL}/api/set/${encodeURIComponent(itemId)}`;
        } else if (type === "minifig") {
          url = `${API_URL}/api/minifig/${encodeURIComponent(itemId)}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Failed to load selected item");
        }

        const data = await response.json();
        setItemData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setItemLoading(false);
      }
    };

    fetchItem();
  }, [type, itemId]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setMessage("");

      const payload = {
        type,
        itemId,
        itemName,
        ...formData,
      };

      const response = await fetch(`${API_URL}/api/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to submit request");
      }

      const data = await response.json();

      setMessage(data.message || "Request submitted successfully.");

      setFormData({
        customerName: "",
        email: "",
        budget: "",
        condition: "Any",
        notes: "",
      });
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong while submitting your request.");
    } finally {
      setSubmitting(false);
    }
  };

  const imageUrl =
    itemData?.set_img_url || itemData?.part_img_url || itemData?.img_url || "";

  return (
    <div className="w-full bg-[#f3f3f3] min-h-screen">
      <section className="w-full bg-yellow-400 border-b-2 border-black">
        <div className="max-w-[1200px] mx-auto px-6 py-20 text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-black mb-3">
            BrickHub Sourcing
          </p>
          <h1 className="text-5xl md:text-6xl font-extrabold text-black">
            Request an Item
          </h1>
          <p className="mt-4 text-lg text-black max-w-[700px] mx-auto">
            Tell us what you want and we’ll try to source it for you.
          </p>
        </div>
      </section>

      <section className="w-full py-16">
        <div className="max-w-[1000px] mx-auto px-6">
          <div className="bg-white border-2 border-black rounded-3xl p-8 md:p-10 shadow-[6px_6px_0px_#000]">
            <div className="mb-8">
              <p className="text-sm font-bold uppercase tracking-wider text-red-600">
                Selected Item
              </p>

              <h2 className="text-3xl md:text-4xl font-extrabold text-black mt-2">
                {itemName}
              </h2>

              <p className="text-gray-700 mt-3">
                <span className="font-bold text-black">Type:</span> {type}
              </p>
              <p className="text-gray-700">
                <span className="font-bold text-black">Item ID:</span> {itemId}
              </p>
            </div>

            {itemLoading && (
              <div className="mb-8 text-gray-600 font-semibold">
                Loading selected item...
              </div>
            )}

            {!itemLoading && imageUrl && (
              <div className="mb-8 flex justify-center">
                <img
                  src={imageUrl}
                  alt={itemName}
                  className="max-h-[280px] w-full max-w-[320px] object-contain"
                />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full rounded-xl border-2 border-black bg-[#f3f3f3] px-4 py-4 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border-2 border-black bg-[#f3f3f3] px-4 py-4 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Budget
                </label>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="Your budget"
                  className="w-full rounded-xl border-2 border-black bg-[#f3f3f3] px-4 py-4 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Preferred Condition
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  className="w-full rounded-xl border-2 border-black bg-[#f3f3f3] px-4 py-4 outline-none font-semibold"
                >
                  <option value="Any">Any</option>
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                  <option value="Complete">Complete</option>
                  <option value="Sealed">Sealed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Tell us extra details like box condition, version, urgency, or anything else."
                  rows="6"
                  className="w-full rounded-xl border-2 border-black bg-[#f3f3f3] px-4 py-4 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-black text-white py-4 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-y-[-2px] transition cursor-pointer disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
            </form>

            {message && (
              <div className="mt-6 p-4 rounded-xl border-2 border-black bg-yellow-100 text-black font-semibold">
                {message}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RequestSource;