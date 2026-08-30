import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  IndianRupee,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Sparkles,
  ArrowRight,
  ClipboardList
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const ArtisanDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, itemsSold: 0 });
  const [loading, setLoading] = useState(true);

  // =========================
  // GET ARTISAN PRODUCTS & ORDERS
  // =========================
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch products
      const prodRes = await api.get("/products");
      const allProds = prodRes.data.products || prodRes.data.product || [];
      // Filter for this artisan's products
      const myProds = allProds.filter(
        (p) => p.artistId?._id === user?._id || p.artistId === user?._id
      );
      setProducts(myProds);

      // Fetch artisan orders & stats
      const orderRes = await api.get("/orders");
      if (orderRes.data.stats) {
        setStats(orderRes.data.stats);
      }
    } catch (error) {
      console.error("Error fetching artisan dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  // =========================
  // DELETE PRODUCT
  // =========================
  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this handcrafted piece from your collection?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <div className="min-h-screen bg-[#17120f] text-[#f5efe8]">
      <Navbar />

      <main className="mx-auto max-w-[1400px] px-5 py-8 md:px-8 lg:py-12">
        {/* ================= WELCOME BANNER ================= */}
        <section className="relative mb-10 overflow-hidden rounded-3xl border border-[#d4af37]/20 bg-gradient-to-br from-[#281e17] via-[#211914] to-[#1b1512] p-8 md:p-12 shadow-2xl">
          <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-[#d4af37]/[0.08] blur-3xl" />
          <div className="absolute -bottom-32 right-1/4 h-64 w-64 rounded-full bg-[#d4af37]/[0.04] blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Sparkles size={14} className="text-[#d4af37]" />
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d4af37]">
                  Master Studio
                </span>
              </div>

              <h1 className="font-serif text-3xl md:text-5xl text-[#f5efe8]">
                Welcome back, {user?.name || "Artisan"}
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#8d8177]">
                Manage your creations, track buyer orders, and share your ancestral craft with the world.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/artisan/orders"
                className="flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-5 py-3.5 text-sm font-semibold text-[#f5efe8] transition hover:border-[#d4af37]/40 hover:bg-white/[0.08]"
              >
                <ClipboardList size={16} className="text-[#d4af37]" />
                Manage Orders ({stats.totalOrders})
              </Link>

              <Link
                to="/add-product"
                className="flex items-center gap-2 rounded-xl bg-[#d4af37] px-6 py-3.5 text-sm font-semibold text-[#17120f] shadow-[0_8px_30px_rgba(212,175,55,0.15)] transition duration-200 hover:bg-[#e7c85c]"
              >
                <Plus size={17} />
                Add Product
              </Link>
            </div>
          </div>
        </section>

        {/* ================= STATS ================= */}
        <section className="mb-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {/* TOTAL PRODUCTS */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#211b17] p-6 shadow-md transition hover:-translate-y-1 hover:border-[#d4af37]/30">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
                <Package size={22} />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#5f554e]">
                Collection
              </span>
            </div>

            <p className="mt-5 text-xs text-[#8d8177]">Total Products</p>
            <p className="mt-1 font-serif text-3xl text-[#f5efe8]">
              {products.length}
            </p>
          </div>

          {/* TOTAL ORDERS */}
          <Link
            to="/artisan/orders"
            className="rounded-2xl border border-white/[0.08] bg-[#211b17] p-6 shadow-md transition hover:-translate-y-1 hover:border-[#d4af37]/30 block"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
                <ShoppingBag size={22} />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#5f554e]">
                Sales
              </span>
            </div>

            <p className="mt-5 text-xs text-[#8d8177]">Total Orders</p>
            <p className="mt-1 font-serif text-3xl text-[#f5efe8]">
              {stats.totalOrders}
            </p>
          </Link>

          {/* TOTAL REVENUE */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#211b17] p-6 shadow-md transition hover:-translate-y-1 hover:border-[#d4af37]/30">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d4af37]/10 text-[#d4af37]">
                <IndianRupee size={22} />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#5f554e]">
                Earnings
              </span>
            </div>

            <p className="mt-5 text-xs text-[#8d8177]">Total Revenue</p>
            <p className="mt-1 font-serif text-3xl text-[#d4af37]">
              ₹{stats.totalRevenue.toLocaleString("en-IN")}
            </p>
          </div>
        </section>

        {/* ================= PRODUCTS TABLE ================= */}
        <section>
          <div className="mb-6 flex items-end justify-between border-b border-white/[0.08] pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
                Artisan Studio Catalog
              </span>
              <h2 className="mt-1 font-serif text-2xl md:text-3xl text-[#f5efe8]">
                My Handcrafted Pieces
              </h2>
            </div>

            <Link
              to="/add-product"
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#d4af37] transition hover:text-[#e7c85c]"
            >
              <Plus size={14} />
              Add Product
            </Link>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-white/[0.08] bg-[#211b17]">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#d4af37]/20 border-t-[#d4af37]" />
              <p className="mt-4 text-xs text-[#8d8177]">Loading your collection...</p>
            </div>
          )}

          {/* EMPTY */}
          {!loading && products.length === 0 && (
            <div className="rounded-3xl border border-dashed border-[#d4af37]/20 bg-[#211b17] px-5 py-24 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#d4af37]/10 text-[#d4af37]">
                <Package size={28} />
              </div>
              <h3 className="mt-6 font-serif text-2xl text-[#f5efe8]">
                Your collection is waiting
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm text-[#8d8177]">
                Add your first handcrafted artifact to make it discoverable in the KalaSetu marketplace.
              </p>
              <Link
                to="/add-product"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#d4af37] px-6 py-3.5 text-sm font-semibold text-[#17120f] transition hover:bg-[#e7c85c]"
              >
                <Plus size={16} />
                Add Your First Creation
              </Link>
            </div>
          )}

          {/* TABLE */}
          {!loading && products.length > 0 && (
            <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#211b17]">
              {/* TABLE HEADER */}
              <div className="hidden grid-cols-[2fr_1fr_1fr_160px] gap-4 border-b border-white/[0.06] bg-white/[0.02] px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#706761] md:grid">
                <span>Product</span>
                <span>Price</span>
                <span>Stock</span>
                <span className="text-right">Actions</span>
              </div>

              {/* ROWS */}
              <div className="divide-y divide-white/[0.06]">
                {products.map((product) => {
                  const displayImg = Array.isArray(product.image) ? product.image[0] : product.image;

                  return (
                    <div
                      key={product._id}
                      className="grid grid-cols-1 gap-4 p-5 transition hover:bg-white/[0.02] md:grid-cols-[2fr_1fr_1fr_160px] md:items-center md:px-6"
                    >
                      {/* PRODUCT */}
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#2a211a] border border-white/[0.08]">
                          {displayImg ? (
                            <img src={displayImg} alt={product.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-[#8d8177]">
                              Piece
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <h4 className="font-serif text-base text-[#f5efe8] truncate">{product.title}</h4>
                          <p className="mt-0.5 text-xs text-[#8d8177]">
                            {product.category} {product.artForm ? `• ${product.artForm}` : ""}
                          </p>
                        </div>
                      </div>

                      {/* PRICE */}
                      <div>
                        <span className="text-xs text-[#706761] md:hidden">Price: </span>
                        <span className="font-serif text-base font-semibold text-[#f5efe8]">
                          ₹{Number(product.price).toLocaleString("en-IN")}
                        </span>
                      </div>

                      {/* STOCK */}
                      <div>
                        <span className="text-xs text-[#706761] md:hidden">Stock: </span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            product.stock <= 2
                              ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                              : "bg-white/[0.05] text-[#c8bfb6]"
                          }`}
                        >
                          {product.stock} in stock
                        </span>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex items-center gap-2 md:justify-end">
                        <button
                          onClick={() => navigate(`/products/${product._id}`)}
                          title="View on Marketplace"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-[#8d8177] transition hover:border-[#d4af37]/40 hover:text-[#d4af37]"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          onClick={() => navigate(`/products/${product._id}/edit`)}
                          title="Edit creation"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-[#8d8177] transition hover:border-[#d4af37]/40 hover:text-[#d4af37]"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          onClick={() => deleteProduct(product._id)}
                          title="Delete creation"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-[#8d8177] transition hover:border-red-500/40 hover:text-red-400"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ArtisanDashboard;