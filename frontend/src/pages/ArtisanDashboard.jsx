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
    User,
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const ArtisanDashboard = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // =========================
    // GET ARTISAN PRODUCTS
    // =========================

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get("/products");
                setProducts(response.data.product || []);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // =========================
    // DELETE PRODUCT
    // =========================

    const deleteProduct = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) return;

        try {
            await api.delete(`/products/${id}`);

            // Remove deleted product from UI
            setProducts((prevProducts) =>
                prevProducts.filter((product) => product._id !== id)
            );
        } catch (error) {
            console.error("Delete error:", error);
            alert(error.response?.data?.message || "Failed to delete product");
        }
    };

    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-[#1c1713] text-[#f5efe8]">
            {/* Your sidebar/header remains the same */}

            <main className="min-h-screen lg:ml-[260px]">
                <header className="flex h-[78px] items-center justify-between border-b border-white/[0.07] px-5 md:px-8">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[#625950]">
                            Artisan Dashboard
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d4af37]/20 bg-[#d4af37]/10">
                            <User size={16} className="text-[#d4af37]" />
                        </div>

                        <button
                            onClick={handleLogout}
                            className="text-xs text-[#8d8177] hover:text-[#d4af37]"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <div className="px-5 py-8 md:px-8 lg:px-10">
                    {/* ================= HEADER ================= */}
                    <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                        <div>
                            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[#d4af37]">
                                Welcome back
                            </p>
                            <h1 className="font-serif text-3xl md:text-4xl">
                                Your Artisan Studio
                            </h1>
                            <p className="mt-2 text-sm text-[#8d8177]">
                                Manage your creations and grow your craft.
                            </p>
                        </div>

                        <Link
                            to="/add-product"
                            className="flex w-fit items-center gap-2 rounded-lg bg-[#d4af37] px-5 py-3 text-sm font-semibold text-[#1c1713] transition hover:bg-[#e7c85c]"
                        >
                            <Plus size={17} />
                            Add Product
                        </Link>
                    </div>

                    {/* ================= STAT ================= */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        <div className="rounded-xl border border-white/[0.07] bg-white/[0.04] p-5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d4af37]/10">
                                <Package size={18} className="text-[#d4af37]" />
                            </div>
                            <p className="mt-5 text-sm text-[#8d8177]">
                                Total Products
                            </p>
                            <p className="mt-1 font-serif text-3xl">
                                {products.length}
                            </p>
                        </div>

                        <div className="rounded-xl border border-white/[0.07] bg-white/[0.04] p-5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d4af37]/10">
                                <ShoppingBag size={18} className="text-[#d4af37]" />
                            </div>
                            <p className="mt-5 text-sm text-[#8d8177]">
                                Total Orders
                            </p>
                            <p className="mt-1 font-serif text-3xl">0</p>
                        </div>

                        <div className="rounded-xl border border-white/[0.07] bg-white/[0.04] p-5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d4af37]/10">
                                <IndianRupee size={18} className="text-[#d4af37]" />
                            </div>
                            <p className="mt-5 text-sm text-[#8d8177]">
                                Total Revenue
                            </p>
                            <p className="mt-1 font-serif text-3xl">₹0</p>
                        </div>
                    </div>

                    {/* ================= PRODUCTS ================= */}
                    <div className="mt-10">
                        <div className="mb-5 flex items-center justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-[0.18em] text-[#d4af37]">
                                    Your Collection
                                </p>
                                <h2 className="mt-1 font-serif text-2xl">
                                    My Products
                                </h2>
                            </div>

                            <Link
                                to="/add-product"
                                className="flex items-center gap-2 text-sm text-[#d4af37] hover:text-[#e7c85c]"
                            >
                                <Plus size={15} />
                                Add Product
                            </Link>
                        </div>

                        {/* ================= LOADING ================= */}
                        {loading && (
                            <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-5 py-16 text-center">
                                <p className="text-sm text-[#8d8177]">
                                    Loading your products...
                                </p>
                            </div>
                        )}

                        {/* ================= NO PRODUCTS ================= */}
                        {!loading && products.length === 0 && (
                            <div className="rounded-xl border border-dashed border-[#d4af37]/20 bg-[#d4af37]/[0.03] px-5 py-16 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#d4af37]/10">
                                    <Package size={24} className="text-[#d4af37]" />
                                </div>

                                <h3 className="mt-5 font-serif text-2xl">
                                    Your collection is empty
                                </h3>

                                <p className="mx-auto mt-2 max-w-md text-sm text-[#8d8177]">
                                    Start showcasing your craft by adding your
                                    first handmade product.
                                </p>

                                <Link
                                    to="/add-product"
                                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#d4af37] px-6 py-3 text-sm font-semibold text-[#1c1713] transition hover:bg-[#e7c85c]"
                                >
                                    <Plus size={17} />
                                    Add Your First Product
                                </Link>
                            </div>
                        )}

                        {/* ================= PRODUCTS ================= */}
                        {!loading && products.length > 0 && (
                            <div className="overflow-hidden rounded-xl border border-white/[0.07]">
                                <div className="hidden grid-cols-[2fr_1fr_1fr_140px] gap-4 border-b border-white/[0.07] bg-white/[0.025] px-5 py-4 text-[10px] uppercase tracking-[0.15em] text-[#625950] md:grid">
                                    <p>Product</p>
                                    <p>Price</p>
                                    <p>Stock</p>
                                    <p className="text-right">Actions</p>
                                </div>

                                {products.map((product) => (
                                    <div
                                        key={product._id}
                                        className="grid grid-cols-1 gap-4 border-b border-white/[0.06] px-5 py-5 last:border-0 md:grid-cols-[2fr_1fr_1fr_140px] md:items-center"
                                    >
                                        {/* Product */}
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={product.image?.[0]}
                                                alt={product.title}
                                                className="h-16 w-16 rounded-lg object-cover"
                                            />

                                            <div>
                                                <h3 className="font-serif text-base">
                                                    {product.title}
                                                </h3>
                                                <p className="mt-1 text-xs text-[#8d8177]">
                                                    {product.category}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <p className="text-sm text-[#c8bfb6]">
                                            ₹{product.price}
                                        </p>

                                        {/* Stock */}
                                        <p className="text-sm text-[#c8bfb6]">
                                            {product.stock} units
                                        </p>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 md:justify-end">
                                            <button
                                                onClick={() =>
                                                    navigate(`/products/${product._id}`)
                                                }
                                                className="flex h-8 w-8 items-center justify-center rounded-md border border-white/[0.08] text-[#8d8177] hover:text-[#d4af37]"
                                            >
                                                <Eye size={14} />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    navigate(`/products/${product._id}/edit`)
                                                }
                                                className="flex h-8 w-8 items-center justify-center rounded-md border border-white/[0.08] text-[#8d8177] hover:text-[#d4af37]"
                                            >
                                                <Pencil size={14} />
                                            </button>

                                            <button
                                                onClick={() => deleteProduct(product._id)}
                                                className="flex h-8 w-8 items-center justify-center rounded-md border border-white/[0.08] text-[#8d8177] hover:text-red-300"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ArtisanDashboard;