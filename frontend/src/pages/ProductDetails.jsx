import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingBag,
  Check,
  MapPin,
  Sparkles,
  Award,
  Box,
  Layers,
  Maximize2,
  Clock,
  User,
  ShieldCheck,
  Truck
} from "lucide-react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data.product);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.response?.data?.message || "Creation not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.stock < 1) return;
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f4]">
        <Navbar />
        <div className="flex min-h-[60vh] flex-col items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#b76532]/20 border-t-[#b76532]" />
          <p className="mt-4 font-serif text-[#706761]">Unveiling masterpiece...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#faf8f4]">
        <Navbar />
        <div className="mx-auto max-w-lg px-5 py-24 text-center">
          <h2 className="font-serif text-3xl text-[#29231f]">Creation Not Found</h2>
          <p className="mt-3 text-sm text-[#706761]">{error || "The artifact you are looking for might have been moved or archived."}</p>
          <button
            onClick={() => navigate("/marketplace")}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#b76532] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#a05527]"
          >
            <ArrowLeft size={16} /> Return to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const images = Array.isArray(product.image) && product.image.length > 0
    ? product.image
    : product.image ? [product.image] : [];

  const mainImage = images[selectedImageIndex] || "";
  const artisan = product.artistId;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="min-h-screen bg-[#faf8f4] text-[#29231f]">
      <Navbar />

      <main className="mx-auto max-w-[1400px] px-5 py-8 md:px-8 lg:py-12">
        {/* BACK LINK */}
        <button
          onClick={() => navigate("/marketplace")}
          className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#706761] transition hover:text-[#b76532]"
        >
          <ArrowLeft size={17} className="transition group-hover:-translate-x-1" />
          Back to Marketplace
        </button>

        {/* MAIN PRODUCT SECTION */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* IMAGE GALLERY (LEFT 7 COLS) */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border border-[#e6ddd4] bg-white shadow-sm">
              <div className="relative aspect-[4/3] w-full bg-[#eee5dc]">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[#a59a90]">
                    No Image Available
                  </div>
                )}

                {product.artForm && (
                  <div className="absolute top-4 left-4 rounded-full bg-[#17120f]/80 backdrop-blur-md px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#d4af37]">
                    {product.artForm}
                  </div>
                )}

                {product.model3D?.enabled && (
                  <div className="absolute top-4 right-4 rounded-full bg-[#d4af37] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#17120f] shadow-md flex items-center gap-1.5">
                    <Box size={14} /> 3D View Enabled
                  </div>
                )}
              </div>

              {/* THUMBNAILS */}
              {images.length > 1 && (
                <div className="flex gap-3 p-4 overflow-x-auto border-t border-[#f0ebe3]">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                        selectedImageIndex === idx
                          ? "border-[#b76532] ring-2 ring-[#b76532]/20"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt={`View ${idx + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3D MODEL PREVIEW IF AVAILABLE */}
            {product.model3D?.enabled && product.model3D?.glbUrl && (
              <div className="mt-6 rounded-2xl border border-[#d4af37]/30 bg-[#211b17] p-6 text-[#f5efe8]">
                <div className="flex items-center gap-3 mb-3">
                  <Box size={20} className="text-[#d4af37]" />
                  <h3 className="font-serif text-lg text-[#f5efe8]">Interactive 3D Experience</h3>
                </div>
                <p className="text-xs text-[#a69b91] mb-4">
                  This handcrafted artifact has a 3D digital twin model.
                </p>
                <a
                  href={product.model3D.glbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#d4af37] px-4 py-2 text-xs font-semibold text-[#17120f] hover:bg-[#e7c85c]"
                >
                  <Maximize2 size={14} /> View 3D Asset
                </a>
              </div>
            )}
          </div>

          {/* PRODUCT SPECS & ACTION (RIGHT 5 COLS) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* CATEGORY & BADGE */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#b76532]">
                  {product.category}
                </span>
                <span className="text-xs text-[#a59a90]">•</span>
                <span className="text-xs text-[#706761]">Handmade</span>
              </div>

              {/* TITLE */}
              <h1 className="mt-2 font-serif text-3xl leading-tight text-[#241b15] md:text-4xl">
                {product.title}
              </h1>

              {/* PRICE */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-serif text-3xl font-bold text-[#241b15]">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-[#8d8177]">Inclusive of all craftsmanship taxes</span>
              </div>

              {/* STOCK STATUS */}
              <div className="mt-4 flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${isOutOfStock ? "bg-red-500" : "bg-emerald-600"}`} />
                <span className="text-xs font-medium text-[#706761]">
                  {isOutOfStock ? "Sold Out" : `${product.stock} units currently available`}
                </span>
              </div>

              {/* SPECIFICATION PILLS */}
              <div className="mt-6 grid grid-cols-2 gap-3 border-y border-[#e6ddd4] py-5 text-xs">
                {product.material && product.material.length > 0 && (
                  <div>
                    <span className="text-[#8d8177]">Material:</span>
                    <p className="mt-0.5 font-medium text-[#29231f]">
                      {Array.isArray(product.material) ? product.material.join(", ") : product.material}
                    </p>
                  </div>
                )}

                {product.dimensions && (product.dimensions.height || product.dimensions.width) && (
                  <div>
                    <span className="text-[#8d8177]">Dimensions:</span>
                    <p className="mt-0.5 font-medium text-[#29231f]">
                      {product.dimensions.height || "-"} × {product.dimensions.width || "-"}
                      {product.dimensions.depth ? ` × ${product.dimensions.depth}` : ""}{" "}
                      {product.dimensions.unit || "cm"}
                    </p>
                  </div>
                )}

                {product.artForm && (
                  <div>
                    <span className="text-[#8d8177]">Art Form:</span>
                    <p className="mt-0.5 font-medium text-[#29231f]">{product.artForm}</p>
                  </div>
                )}

                <div>
                  <span className="text-[#8d8177]">Authenticity:</span>
                  <p className="mt-0.5 font-medium text-[#29231f]">Verified Artisan Handcraft</p>
                </div>
              </div>

              {/* SHORT DESCRIPTION */}
              {product.description && (
                <div className="mt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#706761]">
                    About the Creation
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#5a524b]">
                    {product.description}
                  </p>
                </div>
              )}
            </div>

            {/* CART ACTIONS */}
            <div className="mt-8 rounded-2xl border border-[#e6ddd4] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4">
                {/* QUANTITY PICKER */}
                {!isOutOfStock && (
                  <div className="flex items-center rounded-xl border border-[#e6ddd4] bg-[#faf8f4] p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-lg text-[#706761] hover:bg-white hover:text-[#29231f]"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-[#29231f]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-lg text-[#706761] hover:bg-white hover:text-[#29231f]"
                    >
                      +
                    </button>
                  </div>
                )}

                {/* ADD TO CART BUTTON */}
                <button
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3.5 px-6 text-sm font-semibold transition shadow-md ${
                    isOutOfStock
                      ? "cursor-not-allowed bg-gray-200 text-gray-400"
                      : addedAnimation
                      ? "bg-emerald-700 text-white"
                      : "bg-[#b76532] text-white hover:bg-[#a05527]"
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check size={18} />
                      Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                    </>
                  )}
                </button>
              </div>

              {/* ASSURANCES */}
              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[#f0ebe3] pt-3 text-[11px] text-[#8d8177]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#b76532]" />
                  Direct Artisan Support
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck size={14} className="text-[#b76532]" />
                  Secure Packaging
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            THE STORY BEHIND IT (CORE KALASETU EXPERIENCE)
        ========================================================= */}
        <section className="mt-16 rounded-3xl border border-[#d4af37]/20 bg-[#1c1713] p-8 text-[#f5efe8] md:p-12">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center gap-2 text-[#d4af37]">
              <Sparkles size={16} />
              <span className="text-xs font-semibold uppercase tracking-[0.25em]">
                The Story Behind It
              </span>
            </div>

            <h2 className="mt-3 font-serif text-3xl leading-snug md:text-4xl text-[#f5efe8]">
              {product.story ? "The Journey of This Creation" : "Crafted by Tradition"}
            </h2>

            {product.story ? (
              <p className="mt-4 text-base leading-relaxed text-[#c8bfb6] whitespace-pre-line">
                {product.story}
              </p>
            ) : (
              <p className="mt-4 text-sm leading-relaxed text-[#8d8177]">
                Every handcrafted piece in KalaSetu represents hours of disciplined heritage technique, passed down across generations.
              </p>
            )}

            {/* ARTISAN HIGHLIGHT CARD */}
            {artisan && (
              <div className="mt-10 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                  {artisan.profileImage ? (
                    <img
                      src={artisan.profileImage}
                      alt={artisan.name}
                      className="h-20 w-20 rounded-full object-cover border-2 border-[#d4af37]/40 shadow-lg"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 text-[#d4af37]">
                      <User size={32} />
                    </div>
                  )}

                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
                      Master Artisan
                    </span>
                    <h3 className="font-serif text-2xl text-[#f5efe8]">{artisan.name}</h3>
                    {artisan.location && (
                      <p className="mt-1 flex items-center justify-center sm:justify-start gap-1 text-xs text-[#a69b91]">
                        <MapPin size={13} className="text-[#d4af37]" />
                        {artisan.location}
                      </p>
                    )}
                    {artisan.craft && (
                      <p className="mt-1 text-xs text-[#d4af37]">{artisan.craft}</p>
                    )}
                  </div>
                </div>

                <Link
                  to={`/artisans/${artisan._id}`}
                  className="rounded-xl border border-[#d4af37]/40 bg-[#d4af37]/10 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#e7c85c] transition hover:bg-[#d4af37] hover:text-[#17120f]"
                >
                  Meet the Artisan →
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductDetails;
