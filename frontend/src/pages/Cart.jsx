import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, total, totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#faf8f4] text-[#29231f]">
      <Navbar />

      <main className="mx-auto max-w-[1400px] px-5 py-8 md:px-8 lg:py-12">
        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between border-b border-[#e6ddd4] pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#b76532]">
              Shopping Bag
            </span>
            <h1 className="mt-1 font-serif text-3xl text-[#241b15] md:text-4xl">
              Your Cart
            </h1>
          </div>

          <p className="text-sm text-[#706761]">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </p>
        </div>

        {cartItems.length === 0 ? (
          /* EMPTY STATE */
          <div className="rounded-3xl border border-dashed border-[#d8cec4] bg-white px-5 py-24 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#faf8f4] text-[#b76532]">
              <ShoppingBag size={36} />
            </div>
            <h2 className="mt-6 font-serif text-3xl text-[#29231f]">
              Your cart is waiting for something special.
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#706761]">
              Explore authentic creations handcrafted by master Indian artisans and discover the stories behind them.
            </p>
            <Link
              to="/marketplace"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#b76532] px-8 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#a05527]"
            >
              <Sparkles size={16} />
              Explore Marketplace
            </Link>
          </div>
        ) : (
          /* CART GRID */
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            
            {/* CART ITEMS (LEFT 8 COLS) */}
            <div className="lg:col-span-8 space-y-4">
              {cartItems.map((item) => {
                const maxStock = item.stock !== undefined ? item.stock : 999;
                return (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 rounded-2xl border border-[#e6ddd4] bg-white p-5 shadow-sm transition hover:shadow-md"
                  >
                    {/* PRODUCT INFO */}
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#eee5dc] border border-[#e6ddd4]">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-[#a59a90]">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#b76532]">
                          {item.category || "Handmade"}
                        </span>
                        <h3
                          onClick={() => navigate(`/products/${item._id}`)}
                          className="cursor-pointer font-serif text-lg text-[#241b15] hover:text-[#b76532] truncate max-w-[280px] sm:max-w-[340px]"
                        >
                          {item.title}
                        </h3>
                        <p className="mt-1 text-xs text-[#706761]">
                          ₹{item.price.toLocaleString("en-IN")} each
                        </p>
                      </div>
                    </div>

                    {/* QUANTITY & ACTIONS */}
                    <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-[#f0ebe3]">
                      <div className="flex items-center rounded-xl border border-[#e6ddd4] bg-[#faf8f4] p-1">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-base text-[#706761] hover:bg-white"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-[#29231f]">
                          {item.quantity}
                        </span>
                        <button
                          disabled={item.quantity >= maxStock}
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className={`flex h-8 w-8 items-center justify-center rounded-lg text-base ${
                            item.quantity >= maxStock
                              ? "opacity-30 cursor-not-allowed"
                              : "text-[#706761] hover:bg-white"
                          }`}
                        >
                          +
                        </button>
                      </div>

                      <p className="font-serif text-lg font-semibold text-[#241b15] min-w-[90px] text-right">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>

                      <button
                        onClick={() => removeFromCart(item._id)}
                        title="Remove"
                        className="text-[#a59a90] transition hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}

              <div className="pt-4">
                <Link
                  to="/marketplace"
                  className="inline-flex items-center gap-2 text-sm text-[#706761] transition hover:text-[#b76532]"
                >
                  <ArrowLeft size={16} /> Continue Shopping
                </Link>
              </div>
            </div>

            {/* ORDER SUMMARY (RIGHT 4 COLS) */}
            <div className="lg:col-span-4">
              <div className="rounded-3xl border border-[#e6ddd4] bg-white p-6 shadow-sm">
                <h2 className="font-serif text-2xl text-[#241b15] border-b border-[#f0ebe3] pb-4">
                  Order Summary
                </h2>

                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex justify-between text-[#706761]">
                    <span>Subtotal</span>
                    <span className="font-medium text-[#29231f]">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#706761]">
                    <span>Estimated Shipping</span>
                    <span className="font-medium text-emerald-700">
                      Complimentary (Free)
                    </span>
                  </div>

                  <div className="border-t border-[#f0ebe3] pt-4 flex justify-between text-base font-bold text-[#241b15]">
                    <span>Total</span>
                    <span className="font-serif text-2xl text-[#b76532]">
                      ₹{total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#b76532] py-4 text-sm font-semibold text-white shadow-md transition hover:bg-[#a05527]"
                >
                  Proceed to Checkout
                  <ArrowRight size={17} />
                </button>

                <div className="mt-6 rounded-xl bg-[#faf8f4] p-4 text-xs text-[#706761] space-y-2">
                  <div className="flex items-center gap-2 font-medium text-[#29231f]">
                    <ShieldCheck size={16} className="text-[#b76532]" />
                    Direct from Master Artisans
                  </div>
                  <p className="leading-relaxed">
                    100% of the proceeds directly support the craftspeople who crafted your pieces.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
