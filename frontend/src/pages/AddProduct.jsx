import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    IndianRupee,
    Plus,
    Pencil,
    Trash2,
    Eye,
    LogOut,
    User,
    Menu,
    X,
    Palette,
    ArrowUpRight,
    Sparkles,
} from "lucide-react";

const ArtisanDashboard = () => {
    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // =========================
    // FETCH PRODUCTS
    // =========================

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:5000/api/v1/products",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch products"
                    );
                }

                setProducts(data.products || data.product || []);
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
            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:5000/api/v1/products/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete product"
                );
            }

            setProducts((prev) =>
                prev.filter((product) => product._id !== id)
            );
        } catch (error) {
            console.error("Delete error:", error);
            alert(error.message);
        }
    };

    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
    };

    return (
        <div className="min-h-screen bg-[#17120f] text-[#f5efe8]">

            {/* =========================================
                MOBILE OVERLAY
            ========================================= */}

            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
                />
            )}


            {/* =========================================
                SIDEBAR
            ========================================= */}

            <aside
                className={`fixed left-0 top-0 z-50 flex h-screen w-[245px] flex-col border-r border-[#d4af37]/10 bg-[#1d1713] transition-transform duration-300 ${
                    sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                }`}
            >

                {/* Logo */}

                <div className="flex h-[82px] items-center justify-between border-b border-white/[0.06] px-6">

                    <Link
                        to="/"
                        className="font-serif text-[30px] tracking-tight"
                    >
                        Kala<span className="text-[#d4af37]">Setu</span>
                    </Link>

                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="text-[#8d8177] lg:hidden"
                    >
                        <X size={20} />
                    </button>

                </div>


                {/* Profile */}

                <div className="border-b border-white/[0.06] px-5 py-6">

                    <div className="flex items-center gap-3">

                        <div className="relative">

                            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d4af37]/25 bg-[#d4af37]/10">
                                <Palette
                                    size={18}
                                    className="text-[#d4af37]"
                                />
                            </div>

                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#1d1713] bg-green-400" />

                        </div>

                        <div>
                            <p className="text-sm font-medium">
                                Artisan Studio
                            </p>

                            <p className="mt-0.5 text-[11px] text-[#71665d]">
                                Verified Artisan
                            </p>
                        </div>

                    </div>

                </div>


                {/* Navigation */}

                <nav className="flex-1 px-4 py-7">

                    <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5f554e]">
                        Workspace
                    </p>


                    <div className="space-y-1">

                        <button
                            className="flex w-full items-center gap-3 rounded-lg border border-[#d4af37]/10 bg-[#d4af37]/10 px-3.5 py-3 text-sm text-[#e7c85c]"
                        >
                            <LayoutDashboard size={17} />
                            Dashboard
                        </button>


                        <button
                            className="flex w-full items-center gap-3 rounded-lg px-3.5 py-3 text-sm text-[#82766d] transition hover:bg-white/[0.04] hover:text-[#f5efe8]"
                        >
                            <Package size={17} />
                            My Products
                        </button>


                        <button
                            className="flex w-full items-center gap-3 rounded-lg px-3.5 py-3 text-sm text-[#82766d] transition hover:bg-white/[0.04] hover:text-[#f5efe8]"
                        >
                            <ShoppingBag size={17} />
                            Orders
                        </button>

                    </div>


                    <p className="mb-3 mt-9 px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5f554e]">
                        Account
                    </p>


                    <button
                        className="flex w-full items-center gap-3 rounded-lg px-3.5 py-3 text-sm text-[#82766d] transition hover:bg-white/[0.04] hover:text-[#f5efe8]"
                    >
                        <User size={17} />
                        Profile
                    </button>

                </nav>


                {/* Logout */}

                <div className="border-t border-white/[0.06] p-4">

                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-3.5 py-3 text-sm text-[#82766d] transition hover:bg-red-500/10 hover:text-red-300"
                    >
                        <LogOut size={17} />
                        Logout
                    </button>

                </div>

            </aside>


            {/* =========================================
                MAIN
            ========================================= */}

            <main className="min-h-screen lg:ml-[245px]">

                {/* =========================================
                    TOP BAR
                ========================================= */}

                <header className="sticky top-0 z-30 flex h-[82px] items-center justify-between border-b border-white/[0.06] bg-[#17120f]/90 px-5 backdrop-blur-xl md:px-8">

                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-[#a69b91] lg:hidden"
                    >
                        <Menu size={23} />
                    </button>


                    <div className="hidden lg:block">

                        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#655a52]">
                            Artisan Workspace
                        </p>

                    </div>


                    <div className="flex items-center gap-5">

                        <Link
                            to="/"
                            className="hidden text-xs text-[#8d8177] transition hover:text-[#d4af37] sm:block"
                        >
                            View Marketplace
                        </Link>

                        <div className="h-5 w-px bg-white/[0.08]" />

                        <button
                            onClick={() => navigate("/profile")}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d4af37]/20 bg-[#d4af37]/10 transition hover:border-[#d4af37]/40"
                        >
                            <User
                                size={17}
                                className="text-[#d4af37]"
                            />
                        </button>

                    </div>

                </header>


                {/* =========================================
                    CONTENT
                ========================================= */}

                <div className="w-full px-5 py-8 md:px-8 lg:px-10 xl:px-12">


                    {/* =========================================
                        HERO / WELCOME
                    ========================================= */}

                    <section className="relative mb-9 overflow-hidden rounded-2xl border border-[#d4af37]/10 bg-gradient-to-br from-[#241b15] via-[#211914] to-[#1b1512] px-6 py-7 md:px-8 md:py-8">

                        {/* Decorative circle */}

                        <div className="absolute -right-20 -top-32 h-72 w-72 rounded-full bg-[#d4af37]/[0.06] blur-3xl" />

                        <div className="absolute bottom-[-100px] right-[20%] h-52 w-52 rounded-full bg-[#d4af37]/[0.04] blur-3xl" />


                        <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-center">

                            <div>

                                <div className="mb-3 flex items-center gap-2">

                                    <Sparkles
                                        size={14}
                                        className="text-[#d4af37]"
                                    />

                                    <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#d4af37]">
                                        Welcome back
                                    </p>

                                </div>


                                <h1 className="font-serif text-3xl leading-tight md:text-4xl">
                                    Your Artisan Studio
                                </h1>

                                <p className="mt-2 max-w-lg text-sm leading-6 text-[#8d8177]">
                                    Manage your creations, showcase your craft,
                                    and connect with people who value handmade art.
                                </p>

                            </div>


                            <Link
                                to="/add-product"
                                className="group flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#d4af37] px-6 py-3.5 text-sm font-semibold text-[#17120f] shadow-[0_8px_25px_rgba(212,175,55,0.12)] transition hover:-translate-y-0.5 hover:bg-[#e7c85c]"
                            >
                                <Plus size={17} />

                                Add Product

                                <ArrowUpRight
                                    size={15}
                                    className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                />
                            </Link>

                        </div>

                    </section>


                    {/* =========================================
                        STATISTICS
                    ========================================= */}

                    <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

                        {/* Products */}

                        <div className="group rounded-xl border border-white/[0.07] bg-[#211b17] p-5 transition hover:-translate-y-0.5 hover:border-[#d4af37]/20">

                            <div className="flex items-center justify-between">

                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#d4af37]/10">
                                    <Package
                                        size={18}
                                        className="text-[#d4af37]"
                                    />
                                </div>

                                <span className="text-[10px] uppercase tracking-wider text-[#5f554e]">
                                    Inventory
                                </span>

                            </div>


                            <p className="mt-5 text-xs text-[#82766d]">
                                Total Products
                            </p>

                            <p className="mt-1 font-serif text-3xl">
                                {products.length}
                            </p>

                        </div>


                        {/* Orders */}

                        <div className="group rounded-xl border border-white/[0.07] bg-[#211b17] p-5 transition hover:-translate-y-0.5 hover:border-[#d4af37]/20">

                            <div className="flex items-center justify-between">

                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#d4af37]/10">
                                    <ShoppingBag
                                        size={18}
                                        className="text-[#d4af37]"
                                    />
                                </div>

                                <span className="text-[10px] uppercase tracking-wider text-[#5f554e]">
                                    Sales
                                </span>

                            </div>


                            <p className="mt-5 text-xs text-[#82766d]">
                                Total Orders
                            </p>

                            <p className="mt-1 font-serif text-3xl">
                                0
                            </p>

                        </div>


                        {/* Revenue */}

                        <div className="group rounded-xl border border-white/[0.07] bg-[#211b17] p-5 transition hover:-translate-y-0.5 hover:border-[#d4af37]/20">

                            <div className="flex items-center justify-between">

                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#d4af37]/10">
                                    <IndianRupee
                                        size={18}
                                        className="text-[#d4af37]"
                                    />
                                </div>

                                <span className="text-[10px] uppercase tracking-wider text-[#5f554e]">
                                    Earnings
                                </span>

                            </div>


                            <p className="mt-5 text-xs text-[#82766d]">
                                Total Revenue
                            </p>

                            <p className="mt-1 font-serif text-3xl">
                                ₹0
                            </p>

                        </div>

                    </section>


                    {/* =========================================
                        PRODUCTS HEADER
                    ========================================= */}

                    <section>

                        <div className="mb-5 flex items-end justify-between">

                            <div>

                                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#d4af37]">
                                    Your Collection
                                </p>

                                <h2 className="mt-1 font-serif text-2xl md:text-3xl">
                                    My Products
                                </h2>

                            </div>


                            <Link
                                to="/add-product"
                                className="hidden items-center gap-2 text-sm text-[#d4af37] transition hover:text-[#e7c85c] sm:flex"
                            >
                                <Plus size={15} />
                                Add Product
                            </Link>

                        </div>


                        {/* =========================================
                            LOADING
                        ========================================= */}

                        {loading && (
                            <div className="flex min-h-[280px] items-center justify-center rounded-xl border border-white/[0.07] bg-[#211b17]">

                                <div className="text-center">

                                    <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#d4af37]/20 border-t-[#d4af37]" />

                                    <p className="text-sm text-[#82766d]">
                                        Loading your collection...
                                    </p>

                                </div>

                            </div>
                        )}


                        {/* =========================================
                            EMPTY STATE
                        ========================================= */}

                        {!loading && products.length === 0 && (

                            <div className="rounded-xl border border-dashed border-[#d4af37]/20 bg-gradient-to-br from-[#211b17] to-[#1d1713] px-5 py-20 text-center">

                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#d4af37]/15 bg-[#d4af37]/10">

                                    <Package
                                        size={26}
                                        className="text-[#d4af37]"
                                    />

                                </div>

                                <h3 className="mt-5 font-serif text-2xl">
                                    Your collection is waiting
                                </h3>

                                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#82766d]">
                                    Add your first creation and let people
                                    discover the story behind your craft.
                                </p>

                                <Link
                                    to="/add-product"
                                    className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#d4af37] px-6 py-3 text-sm font-semibold text-[#17120f] transition hover:bg-[#e7c85c]"
                                >
                                    <Plus size={17} />
                                    Add Your First Product
                                </Link>

                            </div>
                        )}


                        {/* =========================================
                            PRODUCT LIST
                        ========================================= */}

                        {!loading && products.length > 0 && (

                            <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#1e1814]">

                                {/* Header */}

                                <div className="hidden grid-cols-[minmax(300px,2.2fr)_1fr_1fr_150px] gap-5 border-b border-white/[0.07] bg-white/[0.025] px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#61574f] md:grid">

                                    <span>Product</span>
                                    <span>Price</span>
                                    <span>Stock</span>
                                    <span className="text-right">
                                        Actions
                                    </span>

                                </div>


                                {/* Products */}

                                {products.map((product) => (

                                    <div
                                        key={product._id}
                                        className="grid grid-cols-1 gap-5 border-b border-white/[0.06] px-5 py-5 transition last:border-0 hover:bg-white/[0.025] md:grid-cols-[minmax(300px,2.2fr)_1fr_1fr_150px] md:items-center md:px-6"
                                    >

                                        {/* Product */}

                                        <div className="flex min-w-0 items-center gap-4">

                                            <div className="h-[68px] w-[68px] shrink-0 overflow-hidden rounded-lg border border-white/[0.08] bg-[#2a211c]">

                                                {product.image ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.title}
                                                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        <Package
                                                            size={20}
                                                            className="text-[#5f554e]"
                                                        />
                                                    </div>
                                                )}

                                            </div>


                                            <div className="min-w-0">

                                                <h3 className="truncate font-serif text-base text-[#f5efe8]">
                                                    {product.title}
                                                </h3>

                                                <p className="mt-1 text-xs capitalize text-[#82766d]">
                                                    {product.category}
                                                </p>

                                            </div>

                                        </div>


                                        {/* Price */}

                                        <div>

                                            <p className="text-xs text-[#625950] md:hidden">
                                                Price
                                            </p>

                                            <p className="mt-1 text-sm text-[#c8bfb6] md:mt-0">
                                                ₹{Number(product.price).toLocaleString("en-IN")}
                                            </p>

                                        </div>


                                        {/* Stock */}

                                        <div>

                                            <p className="text-xs text-[#625950] md:hidden">
                                                Stock
                                            </p>

                                            <p
                                                className={`mt-1 text-sm md:mt-0 ${
                                                    product.stock <= 5
                                                        ? "text-orange-300"
                                                        : "text-[#c8bfb6]"
                                                }`}
                                            >
                                                {product.stock} units
                                            </p>

                                        </div>


                                        {/* Actions */}

                                        <div className="flex items-center justify-start gap-2 md:justify-end">

                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/products/${product._id}`
                                                    )
                                                }
                                                title="View product"
                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-[#82766d] transition hover:border-[#d4af37]/30 hover:bg-[#d4af37]/5 hover:text-[#d4af37]"
                                            >
                                                <Eye size={14} />
                                            </button>


                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/products/${product._id}/edit`
                                                    )
                                                }
                                                title="Edit product"
                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-[#82766d] transition hover:border-[#d4af37]/30 hover:bg-[#d4af37]/5 hover:text-[#d4af37]"
                                            >
                                                <Pencil size={14} />
                                            </button>


                                            <button
                                                onClick={() =>
                                                    deleteProduct(
                                                        product._id
                                                    )
                                                }
                                                title="Delete product"
                                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-[#82766d] transition hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-300"
                                            >
                                                <Trash2 size={14} />
                                            </button>

                                        </div>

                                    </div>

                                ))}

                            </div>
                        )}

                    </section>


                    {/* =========================================
                        MOBILE ADD PRODUCT
                    ========================================= */}

                    <Link
                        to="/add-product"
                        className="mt-6 flex items-center justify-center gap-2 rounded-lg border border-[#d4af37]/20 bg-[#d4af37]/5 py-3 text-sm text-[#d4af37] sm:hidden"
                    >
                        <Plus size={16} />
                        Add Product
                    </Link>


                    {/* =========================================
                        FOOTER MESSAGE
                    ========================================= */}

                    <div className="mt-8 flex flex-col gap-3 border-t border-white/[0.06] pt-6 text-xs text-[#5f554e] sm:flex-row sm:items-center sm:justify-between">

                        <p>
                            Every creation tells a story.
                        </p>

                        <p>
                            KalaSetu Artisan Studio
                        </p>

                    </div>

                </div>

            </main>
        </div>
    );
};

export default ArtisanDashboard;