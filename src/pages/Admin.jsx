import React, { useState } from "react";
import Footer from "../components/Footer";
import { API_URL } from "../config";

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString();
};

const Admin = () => {
  // null = not logged in. A non-null string is the password that has
  // already been confirmed to work against the backend.
  const [password, setPassword] = useState(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [editedProducts, setEditedProducts] = useState({});
  const [savingId, setSavingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetches all three admin datasets using the given password. Used both
  // for the initial login attempt and for later reloads. Returns true if
  // the password was accepted.
  const loadAll = async (pwd) => {
    setLoading(true);
    setError("");

    try {
      const endpoints = [
        { path: "/api/admin/products", setter: setProducts },
        { path: "/api/admin/orders", setter: setOrders },
        { path: "/api/admin/requests", setter: setRequests },
      ];

      for (const { path, setter } of endpoints) {
        const response = await fetch(`${API_URL}${path}`, {
          headers: { "x-admin-password": pwd },
        });

        if (response.status === 401) {
          setPassword(null);
          setLoginError("Incorrect password.");
          return false;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load admin data.");
        }

        setter(data);
      }

      setPassword(pwd);
      return true;
    } catch (err) {
      console.error(err);
      setError("Something went wrong while loading admin data.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    await loadAll(passwordInput);
    setLoginLoading(false);
  };

  const handleLogout = () => {
    setPassword(null);
    setPasswordInput("");
    setProducts([]);
    setOrders([]);
    setRequests([]);
    setEditedProducts({});
  };

  const handleFieldChange = (id, field, value) => {
    setEditedProducts((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSaveProduct = async (product) => {
    const edits = editedProducts[product.id] || {};
    const price = edits.price !== undefined ? edits.price : product.price;
    const stock = edits.stock !== undefined ? edits.stock : product.stock;

    setSavingId(product.id);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ price, stock }),
      });

      if (response.status === 401) {
        setPassword(null);
        setLoginError("Session expired. Please log in again.");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save product.");
      }

      setProducts((prev) => prev.map((p) => (p.id === product.id ? data : p)));
      setEditedProducts((prev) => {
        const next = { ...prev };
        delete next[product.id];
        return next;
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to save product.");
    } finally {
      setSavingId(null);
    }
  };

  if (password === null) {
    return (
      <div className="w-full bg-[#f3f3f3] min-h-screen">
        <section className="w-full bg-black border-b-2 border-black">
          <div className="max-w-[1200px] mx-auto px-6 py-20 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">
              Admin Login
            </h1>
          </div>
        </section>

        <section className="w-full py-20">
          <div className="max-w-[420px] mx-auto px-6">
            <div className="bg-white border-2 border-black rounded-3xl p-8 shadow-[6px_6px_0px_#000]">
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Admin Password
                  </label>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter admin password"
                    autoFocus
                    className="w-full rounded-xl border-2 border-black bg-[#f3f3f3] px-4 py-4 outline-none text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loginLoading || !passwordInput}
                  className="w-full bg-black text-white py-4 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-y-[-2px] transition cursor-pointer disabled:opacity-60"
                >
                  {loginLoading ? "Checking..." : "Log In"}
                </button>

                {loginError && (
                  <p className="text-red-600 font-semibold text-sm">{loginError}</p>
                )}
              </form>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f3f3f3] min-h-screen">
      <section className="w-full bg-black border-b-2 border-black">
        <div className="max-w-[1200px] mx-auto px-6 py-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Admin Dashboard
          </h1>

          <button
            onClick={handleLogout}
            className="bg-white text-black px-5 py-3 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-y-[-2px] transition cursor-pointer w-fit"
          >
            Log Out
          </button>
        </div>
      </section>

      <section className="w-full py-16">
        <div className="max-w-[1200px] mx-auto px-6 space-y-16">
          {loading && (
            <div className="bg-white border-2 border-black rounded-2xl p-10 text-center shadow-[4px_4px_0px_#000]">
              Loading...
            </div>
          )}

          {error && (
            <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_#000] text-red-600 font-semibold">
              {error}
            </div>
          )}

          {!loading && (
            <>
              <div>
                <h2 className="text-3xl font-extrabold text-black mb-6">Products</h2>

                <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000] overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-black text-white uppercase text-xs tracking-wider">
                        <th className="text-left px-4 py-3">Name</th>
                        <th className="text-left px-4 py-3">SKU</th>
                        <th className="text-left px-4 py-3">Type</th>
                        <th className="text-left px-4 py-3">Price</th>
                        <th className="text-left px-4 py-3">Stock</th>
                        <th className="text-left px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => {
                        const edits = editedProducts[product.id] || {};
                        const priceValue =
                          edits.price !== undefined ? edits.price : product.price;
                        const stockValue =
                          edits.stock !== undefined ? edits.stock : product.stock;

                        return (
                          <tr key={product.id} className="border-t-2 border-black">
                            <td className="px-4 py-3 font-semibold text-black">
                              {product.name}
                            </td>
                            <td className="px-4 py-3 text-gray-600">{product.sku}</td>
                            <td className="px-4 py-3 text-gray-600">{product.type}</td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={priceValue}
                                onChange={(e) =>
                                  handleFieldChange(product.id, "price", e.target.value)
                                }
                                className="w-24 rounded-lg border-2 border-black bg-[#f3f3f3] px-2 py-1 outline-none"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                step="1"
                                min="0"
                                value={stockValue}
                                onChange={(e) =>
                                  handleFieldChange(product.id, "stock", e.target.value)
                                }
                                className="w-20 rounded-lg border-2 border-black bg-[#f3f3f3] px-2 py-1 outline-none"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleSaveProduct(product)}
                                disabled={savingId === product.id}
                                className="bg-black text-white px-4 py-2 rounded-lg font-bold hover:opacity-80 transition cursor-pointer disabled:opacity-60"
                              >
                                {savingId === product.id ? "Saving..." : "Save"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-extrabold text-black mb-6">Orders</h2>

                <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000] overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-black text-white uppercase text-xs tracking-wider">
                        <th className="text-left px-4 py-3">Customer</th>
                        <th className="text-left px-4 py-3">Email</th>
                        <th className="text-left px-4 py-3">Total</th>
                        <th className="text-left px-4 py-3">Status</th>
                        <th className="text-left px-4 py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-t-2 border-black">
                          <td className="px-4 py-3 font-semibold text-black">
                            {order.customer_name}
                          </td>
                          <td className="px-4 py-3 text-gray-600">{order.email}</td>
                          <td className="px-4 py-3 text-gray-600">
                            ${Number(order.total).toFixed(2)}
                          </td>
                          <td className="px-4 py-3 text-gray-600">{order.status}</td>
                          <td className="px-4 py-3 text-gray-600">
                            {formatDate(order.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {orders.length === 0 && (
                    <p className="p-6 text-gray-600">No orders yet.</p>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-extrabold text-black mb-6">
                  Sourcing Requests
                </h2>

                <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000] overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-black text-white uppercase text-xs tracking-wider">
                        <th className="text-left px-4 py-3">Customer</th>
                        <th className="text-left px-4 py-3">Email</th>
                        <th className="text-left px-4 py-3">Item</th>
                        <th className="text-left px-4 py-3">Type</th>
                        <th className="text-left px-4 py-3">Budget</th>
                        <th className="text-left px-4 py-3">Status</th>
                        <th className="text-left px-4 py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((request) => (
                        <tr key={request.id} className="border-t-2 border-black">
                          <td className="px-4 py-3 font-semibold text-black">
                            {request.customer_name}
                          </td>
                          <td className="px-4 py-3 text-gray-600">{request.email}</td>
                          <td className="px-4 py-3 text-gray-600">{request.item_name}</td>
                          <td className="px-4 py-3 text-gray-600">{request.type}</td>
                          <td className="px-4 py-3 text-gray-600">{request.budget}</td>
                          <td className="px-4 py-3 text-gray-600">{request.status}</td>
                          <td className="px-4 py-3 text-gray-600">
                            {formatDate(request.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {requests.length === 0 && (
                    <p className="p-6 text-gray-600">No sourcing requests yet.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Admin;
