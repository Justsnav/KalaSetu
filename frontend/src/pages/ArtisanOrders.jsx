import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Clock,
  MapPin,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  Truck,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const statusList = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const statusConfig = {
  pending: { label: "Pending", bg: "bg-amber-500/10", text: "text-amber-300", border: "border-amber-500/30" },
  confirmed: { label: "Confirmed", bg: "bg-blue-500/10", text: "text-blue-300", border: "border-blue-500/30" },
  shipped: { label: "Shipped", bg: "bg-purple-500/10", text: "text-purple-300", border: "border-purple-500/30" },
  delivered: { label: "Delivered", bg: "bg-emerald-500/10", text: "text-emerald-300", border: "border-emerald-500/30" },
  cancelled: { label: "Cancelled", bg: "bg-red-500/10", text: "text-red-300", border: "border-red-500/30" }
};

const ArtisanOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/orders");
      setOrders(response.data.orders || []);
    } catch (err) {
      console.error("Error fetching artisan orders:", err);
      setError("Failed to load customer orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert(err.response?.data?.message || "Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#17120f] text-[#f5efe8]">
      <Navbar />

      <main className="mx-auto max-w-[1300px] px-5 py-8 md:px-8 lg:py-12">
        {/* BACK LINK */}
        <Link
          to="/artisan/dashboard"
          className="group mb-8 inline-flex items-center gap-2 text-sm text-[#8d8177] transition hover:text-[#d4af37]"
        >
          <ArrowLeft size={16} className="transition group-hover:-translate-x-1" />
          Back to Dashboard
        </Link>

        {/* HEADER */}
        <div className="mb-8 border-b border-white/[0.08] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d4af37]">
              Customer Orders
            </span>
            <h1 className="mt-1 font-serif text-3xl md:text-4xl text-[#f5efe8]">
              Manage Workshop Orders
            </h1>
          </div>

          <p className="text-xs text-[#8d8177]">
            {orders.length} {orders.length === 1 ? "order received" : "orders received"}
          </p>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex min-h-[300px] flex-col items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#d4af37]/20 border-t-[#d4af37]" />
            <p className="mt-4 text-xs text-[#8d8177]">Loading customer orders...</p>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center">
            <p className="text-sm text-red-300">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#d4af37] px-4 py-2 text-xs font-semibold text-[#17120f]"
            >
              <RefreshCw size={13} /> Retry
            </button>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && orders.length === 0 && (
          <div className="rounded-3xl border border-dashed border-white/[0.08] bg-white/[0.02] px-5 py-24 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#d4af37]/10 text-[#d4af37]">
              <ShoppingBag size={28} />
            </div>
            <h3 className="mt-6 font-serif text-2xl text-[#f5efe8]">
              No orders yet
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#8d8177]">
              When buyers order your handcrafted creations, they will appear here with shipping destinations and status controls.
            </p>
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

              // Filter items that belong to this artisan
              const myItems = order.items.filter(
                (item) => item.artisan?._id === user?._id || item.artisan === user?._id
              );

              const artisanOrderTotal = myItems.reduce((acc, i) => acc + i.price * i.quantity, 0);

              return (
                <div
                  key={order._id}
                  className="rounded-3xl border border-white/[0.08] bg-[#211b17] p-6 md:p-8 shadow-xl"
                >
                  {/* TOP HEADER */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-5">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-semibold text-[#f5efe8]">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </span>
                        <span
                          className={`rounded-full border px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[#8d8177] flex items-center gap-1">
                        <Clock size={12} /> Received on {formattedDate}
                      </p>
                    </div>

                    {/* STATUS UPDATE DROPDOWN */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#8d8177]">Update Status:</span>
                      <select
                        value={order.status}
                        disabled={updatingId === order._id}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="rounded-xl border border-white/[0.1] bg-[#1a1411] px-3 py-2 text-xs font-semibold text-[#f5efe8] outline-none focus:border-[#d4af37]"
                      >
                        {statusList.map((st) => (
                          <option key={st} value={st}>
                            {statusConfig[st]?.label || st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* ITEMS LIST */}
                  <div className="py-5 divide-y divide-white/[0.06]">
                    {myItems.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#2a211a] border border-white/[0.08]">
                            {item.image ? (
                              <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-[#8d8177]">
                                Item
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <h4 className="font-serif text-base text-[#f5efe8] truncate">{item.title}</h4>
                            <p className="text-xs text-[#8d8177]">
                              Qty: <strong className="text-[#f5efe8]">{item.quantity}</strong> • ₹{item.price?.toLocaleString("en-IN")} each
                            </p>
                          </div>
                        </div>

                        <p className="font-serif text-base font-semibold text-[#d4af37] shrink-0">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* FOOTER: SHIPPING INFO & REVENUE */}
                  <div className="border-t border-white/[0.06] pt-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#8d8177] gap-3">
                    {order.shippingAddress && (
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-[#d4af37]" />
                        <span>
                          Ship To: <strong className="text-[#f5efe8]">{order.shippingAddress.city}, {order.shippingAddress.state}</strong> ({order.shippingAddress.pincode})
                        </span>
                      </div>
                    )}

                    <div className="text-right">
                      <span>Artisan Revenue: </span>
                      <strong className="font-serif text-base text-[#f5efe8]">
                        ₹{artisanOrderTotal.toLocaleString("en-IN")}
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default ArtisanOrders;
