import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, Sparkles, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import api from "../api/axios";

const Marketplace = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [artForm, setArtForm] = useState("all");
    const [sortBy, setSortBy] = useState("latest");

    // =====================================================
    // FETCH PRODUCTS FROM REAL BACKEND
    // =====================================================
    const fetchProducts = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await api.get("/products");
            const data = response.data;
            setProducts(data.products || data.product || []);
        } catch (err) {
            console.error("Marketplace fetch error:", err);
            setError(err.response?.data?.message || "Failed to load creations. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // =====================================================
    // FILTER & SEARCH PRODUCTS
    // =====================================================
    const filteredProducts = products.filter((product) => {
        const titleMatch = product.title?.toLowerCase().includes(search.toLowerCase());
        const categoryMatch = product.category?.toLowerCase().includes(search.toLowerCase());
        const artFormMatch = product.artForm?.toLowerCase().includes(search.toLowerCase());
        const materialMatch = Array.isArray(product.material)
            ? product.material.some(m => m.toLowerCase().includes(search.toLowerCase()))
            : product.material?.toLowerCase().includes(search.toLowerCase());

        const matchesSearch = !search || titleMatch || categoryMatch || artFormMatch || materialMatch;
        const matchesCategory = category === "all" || product.category === category;
        const matchesArtForm = artForm === "all" || product.artForm === artForm;

        return matchesSearch && matchesCategory && matchesArtForm;
    }).sort((a, b) => {
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    // =====================================================
    // UNIQUE CATEGORIES & ART FORMS
    // =====================================================
    const categories = [
        "all",
        ...new Set(products.map((p) => p.category).filter(Boolean)),
    ];

    const artForms = [
        "all",
        ...new Set(products.map((p) => p.artForm).filter(Boolean)),
    ];

    return (
        <div className="min-h-screen bg-[#faf8f4] text-[#29231f]">
            {/* NAVBAR */}
            <Navbar />

            {/* HERO */}
            <section className="relative px-5 pb-10 pt-12 text-center md:pt-16 bg-gradient-to-b from-[#f0ebe3] to-[#faf8f4] border-b border-[#e9e3dc]">
                <div className="mx-auto max-w-4xl">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#b76532]/25 bg-[#b76532]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#b76532]">
                        <Sparkles size={13} />
                        The KalaSetu Marketplace
                    </span>

                    <h1 className="mt-4 font-serif text-4xl leading-tight md:text-6xl text-[#241b15]">
                        Discover Handmade <span className="text-[#b76532]">Stories</span>
                    </h1>

                    <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#706761] md:text-base">
                        Explore authentic handcrafted creations straight from the hands of master Indian artisans.
                    </p>
                </div>
            </section>

            {/* SEARCH & FILTERS */}
            <section className="mx-auto max-w-[1400px] px-5 -mt-6 md:px-8">
                <div className="flex flex-col gap-3 rounded-2xl border border-[#e6ddd4] bg-white p-4 shadow-lg md:flex-row md:items-center">
                    
                    {/* SEARCH INPUT */}
                    <div className="relative flex-1">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9b9087]"
                        />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by artwork, category, art form, material..."
                            className="h-12 w-full rounded-xl bg-[#faf8f4] pl-11 pr-4 text-sm outline-none placeholder:text-[#aaa099] focus:ring-2 focus:ring-[#b76532]/30"
                        />
                    </div>

                    {/* CATEGORY FILTER */}
                    <div className="relative md:w-[200px]">
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            aria-label="Filter by category"
                            className="h-12 w-full appearance-none rounded-xl bg-[#faf8f4] px-4 text-sm capitalize outline-none cursor-pointer focus:ring-2 focus:ring-[#b76532]/30 text-[#29231f]"
                        >
                            {categories.map((item) => (
                                <option key={item} value={item}>
                                    {item === "all" ? "All Categories" : item}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* ART FORM FILTER */}
                    {artForms.length > 1 && (
                        <div className="relative md:w-[190px]">
                            <select
                                value={artForm}
                                onChange={(e) => setArtForm(e.target.value)}
                                aria-label="Filter by art form"
                                className="h-12 w-full appearance-none rounded-xl bg-[#faf8f4] px-4 text-sm capitalize outline-none cursor-pointer focus:ring-2 focus:ring-[#b76532]/30 text-[#29231f]"
                            >
                                {artForms.map((form) => (
                                    <option key={form} value={form}>
                                        {form === "all" ? "All Art Forms" : form}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* SORT FILTER */}
                    <div className="relative md:w-[170px]">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            aria-label="Sort products"
                            className="h-12 w-full appearance-none rounded-xl bg-[#faf8f4] px-4 text-sm outline-none cursor-pointer focus:ring-2 focus:ring-[#b76532]/30 text-[#29231f]"
                        >
                            <option value="latest">Latest</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* PRODUCT GRID */}
            <section className="mx-auto max-w-[1400px] px-5 py-12 md:px-8">
                
                {/* SECTION HEADER */}
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b76532]">
                            Curated Collection
                        </p>
                        <h2 className="mt-1 font-serif text-3xl text-[#241b15]">
                            Handcrafted Artworks
                        </h2>
                    </div>

                    <p className="text-sm text-[#887d75]">
                        Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'creation' : 'creations'}
                    </p>
                </div>

                {/* ERROR STATE */}
                {error && (
                    <div className="rounded-2xl border border-red-300 bg-red-50 p-8 text-center">
                        <p className="text-sm font-medium text-red-800">{error}</p>
                        <button
                            onClick={fetchProducts}
                            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#b76532] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#a05527]"
                        >
                            <RefreshCw size={14} /> Retry
                        </button>
                    </div>
                )}

                {/* LOADING STATE */}
                {loading && (
                    <div className="flex min-h-[360px] flex-col items-center justify-center">
                        <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#b76532]/20 border-t-[#b76532]" />
                        <p className="mt-4 text-sm text-[#887d75]">Loading authentic creations...</p>
                    </div>
                )}

                {/* EMPTY STATE */}
                {!loading && !error && filteredProducts.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-[#d8cec4] bg-white px-5 py-20 text-center shadow-sm">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#faf8f4] text-[#b76532]">
                            <Sparkles size={28} />
                        </div>
                        <h3 className="font-serif text-2xl text-[#29231f]">
                            Nothing here yet.
                        </h3>
                        <p className="mx-auto mt-2 max-w-md text-sm text-[#82766d]">
                            No artworks matched your current filters. Try searching for something else or reset your criteria.
                        </p>
                        {(search || category !== "all" || artForm !== "all") && (
                            <button
                                onClick={() => {
                                    setSearch("");
                                    setCategory("all");
                                    setArtForm("all");
                                }}
                                className="mt-6 rounded-lg bg-[#b76532] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#a05527]"
                            >
                                Reset Filters
                            </button>
                        )}
                    </div>
                )}

                {/* GRID */}
                {!loading && !error && filteredProducts.length > 0 && (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                onClick={() => navigate(`/products/${product._id}`)}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Marketplace;