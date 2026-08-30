import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Clock, MapPin, Sparkles, ArrowRight, RefreshCw, CheckCircle, Truck } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

const statusConfig = {
  pending: { label: "Pending Verification", bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-200" },
  confirmed: { label: "Artisan Confirmed", bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200" },
  shipped: { label: "In Transit / Shipped", bg: "bg-purple-50", text: "text-purple-800", border: "border-purple-200" },
  delivered: { label: "Delivered", bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200" },
  cancelled: { label: "Cancelled", bg: "bg-red-50", text: "text-red-800", border: "border-red-200" }
};

const BuyerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/orders");
      setOrders(response.data.orders || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError(err.response?.data?.message || "Failed to load your orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#faf8f4] text-[#29231f]">
      <Navbar />

      <main className="mx-auto max-w-[1200px] px-5 py-8 md:px-8 lg:py-12">
        {/* HEADER */}
        <div className="mb-8 border-b border-[#e6ddd4] pb-6 flex items-end justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#b76532]">
              Order History
            </span>
            <h1 className="mt-1 font-serif text-3xl text-[#241b15] md:text-4xl">
              My Orders
            </h1>
          </div>

          <p className="text-xs text-[#8d8177]">
            {orders.length} {orders.length === 1 ? "order placed" : "orders placed"}
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex min-h-[300px] flex-col items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#b76532]/20 border-t-[#b76532]" />
            <p className="mt-4 text-xs text-[#8d8177]">Loading order history...</p>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm text-red-800">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#b76532] px-4 py-2 text-xs font-semibold text-white"
            >
              <RefreshCw size={13} /> Try Again
            </button>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && orders.length === 0 && (
          <div className="rounded-3xl border border-dashed border-[#d8cec4] bg-white px-5 py-24 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#faf8f4] text-[#b76532]">
              <Package size={36} />
            </div>
            <h2 className="mt-6 font-serif text-3xl text-[#29231f]">
              Your journey hasn't begun yet.
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#706761]">
              You haven't placed any orders yet. Discover timeless handcrafted creations and support Indian artisans.
            </p>
            <Link
              to="/marketplace"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#b76532] px-8 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#a05527]"
            >
              <Sparkles size={16} />
              Explore Marketplace
            </Link>
          </div>
        )}

        {/* ORDERS LIST */}
        {!loading && !error && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusInfo = statusConfig[order.status] || statusConfig.pending;
              const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric"
              });

              return (
                <div
                  key={order._id}
                  className="rounded-3xl border border-[#e6ddd4] bg-white p-6 md:p-8 shadow-sm transition hover:shadow-md"
                >
                  {/* ORDER CARD HEADER */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f0ebe3] pb-5">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-semibold text-[#241b15]">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </span>
                        <span
                          className={`rounded-full border px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[#8d8177] flex items-center gap-1">
                        <Clock size={12} /> Placed on {formattedDate}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-[#8d8177]">Total Paid</span>
                      <p className="font-serif text-2xl font-bold text-[#b76532]">
                        ₹{order.totalAmount?.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {/* ITEMS LIST */}
                  <div className="py-5 divide-y divide-[#f0ebe3]">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#eee5dc] border border-[#e6ddd4]">
                            {item.image ? (
                              <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-[#a59a90]">
                                Item
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <h4 className="font-serif text-base text-[#241b15] truncate">{item.title}</h4>
                            <p className="text-xs text-[#706761]">
                              Quantity: <span className="font-medium">{item.quantity}</span> • ₹{item.price?.toLocaleString("en-IN")} each
                            </p>
                            {item.artisan && (
                              <p className="text-[11px] text-[#8d8177]">
                                Artisan: {item.artisan.name || "Master Artisan"}
                              </p>
                            )}
                          </div>
                        </div>

                        <p className="font-serif text-base font-semibold text-[#241b15] shrink-0">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* SHIPPING DESTINATION FOOTER */}
                  {order.shippingAddress && (
                    <div className="border-t border-[#f0ebe3] pt-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#706761] gap-2">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-[#b76532]" />
                        <span>
                          Shipping to: <strong className="text-[#29231f]">{order.shippingAddress.fullName}</strong> ({order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode})
                        </span>
                      </div>

                      <span className="text-[11px] text-[#8d8177]">
                        Contact: {order.shippingAddress.phone}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default BuyerOrders;
