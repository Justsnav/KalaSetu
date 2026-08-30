import { useParams, Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, Package, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar";

const OrderSuccess = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-[#faf8f4] text-[#29231f]">
      <Navbar />

      <main className="mx-auto max-w-2xl px-5 py-16 md:py-24 text-center">
        <div className="rounded-3xl border border-[#e6ddd4] bg-white p-8 md:p-12 shadow-md">
          {/* SUCCESS ICON */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
            <CheckCircle2 size={44} />
          </div>

          <span className="mt-6 inline-block text-xs font-bold uppercase tracking-[0.2em] text-[#b76532]">
            Order Confirmed
          </span>

          <h1 className="mt-2 font-serif text-3xl md:text-4xl text-[#241b15]">
            Thank You for Supporting Indian Craftsmanship
          </h1>

          <p className="mt-4 text-sm text-[#706761] leading-relaxed">
            Your order has been received and routed directly to the artisan workshop. Every creation will be prepared with authentic care.
          </p>

          {/* ORDER ID BOX */}
          <div className="mt-8 rounded-2xl bg-[#faf8f4] border border-[#e6ddd4] p-4 text-xs">
            <span className="text-[#8d8177]">Order Reference Number</span>
            <p className="mt-1 font-mono text-base font-semibold text-[#241b15]">
              #{id}
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/orders"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#b76532] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#a05527]"
            >
              <Package size={16} />
              View My Orders
            </Link>

            <Link
              to="/marketplace"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-[#e6ddd4] bg-white px-6 py-3.5 text-sm font-semibold text-[#29231f] transition hover:bg-[#faf8f4]"
            >
              Continue Exploring
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderSuccess;
