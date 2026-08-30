import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import api from "../api/axios";

const Checkout = () => {
  const { cartItems, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    address: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    pincode: user?.address?.pincode || ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      setError("Please fill out all shipping fields.");
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        items: cartItems.map(item => ({
          product: item._id,
          quantity: item.quantity,
          title: item.title
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        }
      };

      const response = await api.post("/orders", orderPayload);
      const createdOrder = response.data.order;

      // Clear the local cart
      clearCart();

      // Navigate to order success screen
      navigate(`/order-success/${createdOrder._id}`, { state: { order: createdOrder } });
    } catch (err) {
      console.error("Order placement error:", err);
      setError(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f4] text-[#29231f]">
      <Navbar />

      <main className="mx-auto max-w-[1200px] px-5 py-8 md:px-8 lg:py-12">
        {/* BACK LINK */}
        <Link
          to="/cart"
          className="group mb-8 inline-flex items-center gap-2 text-sm text-[#706761] transition hover:text-[#b76532]"
        >
          <ArrowLeft size={16} className="transition group-hover:-translate-x-1" />
          Back to Cart
        </Link>

        {/* HEADER */}
        <div className="mb-8 border-b border-[#e6ddd4] pb-5">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#b76532]">
            Final Step
          </span>
          <h1 className="mt-1 font-serif text-3xl text-[#241b15] md:text-4xl">
            Secure Checkout
          </h1>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            <AlertCircle size={18} className="shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          
          {/* SHIPPING FORM (LEFT 7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl border border-[#e6ddd4] bg-white p-6 md:p-8 shadow-sm">
              <h2 className="font-serif text-2xl text-[#241b15] border-b border-[#f0ebe3] pb-4">
                Delivery Address
              </h2>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#706761] mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Priya Sharma"
                    className="w-full rounded-xl border border-[#e6ddd4] bg-[#faf8f4] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#b76532]/30 text-[#29231f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#706761] mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="e.g. +91 98765 43210"
                    className="w-full rounded-xl border border-[#e6ddd4] bg-[#faf8f4] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#b76532]/30 text-[#29231f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#706761] mb-1.5">
                    Street Address *
                  </label>
                  <textarea
                    rows={3}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="House / Flat / Building No., Street / Area"
                    className="w-full rounded-xl border border-[#e6ddd4] bg-[#faf8f4] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#b76532]/30 text-[#29231f] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#706761] mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Jaipur"
                      className="w-full rounded-xl border border-[#e6ddd4] bg-[#faf8f4] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#b76532]/30 text-[#29231f]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#706761] mb-1.5">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Rajasthan"
                      className="w-full rounded-xl border border-[#e6ddd4] bg-[#faf8f4] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#b76532]/30 text-[#29231f]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#706761] mb-1.5">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                      placeholder="e.g. 302001"
                      className="w-full rounded-xl border border-[#e6ddd4] bg-[#faf8f4] px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#b76532]/30 text-[#29231f]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* PAYMENT INFORMATION */}
            <div className="rounded-3xl border border-[#e6ddd4] bg-white p-6 md:p-8 shadow-sm">
              <h2 className="font-serif text-xl text-[#241b15] border-b border-[#f0ebe3] pb-4 flex items-center justify-between">
                <span>Payment Method</span>
                <span className="text-xs font-sans text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-medium">
                  Direct Verification / Cash on Delivery
                </span>
              </h2>
              <p className="mt-4 text-xs text-[#706761] leading-relaxed">
                Orders are verified directly with the artisan. Complete payment integration (Razorpay / UPI) is ready for live deployment.
              </p>
            </div>
          </div>

          {/* ORDER REVIEW (RIGHT 5 COLS) */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-[#e6ddd4] bg-white p-6 shadow-sm sticky top-28">
              <h2 className="font-serif text-2xl text-[#241b15] border-b border-[#f0ebe3] pb-4">
                Order Review
              </h2>

              {/* PRODUCT LIST */}
              <div className="mt-4 max-h-[300px] overflow-y-auto space-y-3 pr-2 divide-y divide-[#f0ebe3]">
                {cartItems.map((item) => (
                  <div key={item._id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#eee5dc] border border-[#e6ddd4]">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-[9px] text-[#a59a90]">
                            Art
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-serif text-[#29231f] truncate max-w-[170px]">{item.title}</p>
                        <p className="text-[11px] text-[#8d8177]">Qty: {item.quantity}</p>
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-[#29231f] shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              {/* TOTALS */}
              <div className="mt-6 border-t border-[#f0ebe3] pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-[#706761]">
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-[#706761]">
                  <span>Shipping</span>
                  <span className="text-emerald-700">Free</span>
                </div>
                <div className="border-t border-[#f0ebe3] pt-3 flex justify-between font-bold text-base text-[#241b15]">
                  <span>Total Amount</span>
                  <span className="font-serif text-2xl text-[#b76532]">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* PLACE ORDER BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#b76532] py-4 text-sm font-semibold text-white shadow-md transition ${
                  loading ? "opacity-75 cursor-wait" : "hover:bg-[#a05527]"
                }`}
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Place Order
                  </>
                )}
              </button>

              <div className="mt-4 text-center">
                <span className="text-[11px] text-[#a59a90] flex items-center justify-center gap-1">
                  <ShieldCheck size={13} className="text-[#b76532]" />
                  Secure Handmade Order Commitment
                </span>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Checkout;
