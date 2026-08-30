import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Sparkles,
  Award,
  BookOpen,
  User,
  Package,
  Heart
} from "lucide-react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import api from "../api/axios";

const ArtisanProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [artisan, setArtisan] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArtisanData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get(`/auth/artisans/${id}`);
        setArtisan(response.data.artisan);
        setProducts(response.data.products || []);
      } catch (err) {
        console.error("Failed to load artisan profile:", err);
        setError("Artisan profile could not be found.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtisanData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#17120f]">
        <Navbar />
        <div className="flex min-h-[60vh] flex-col items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#d4af37]/20 border-t-[#d4af37]" />
          <p className="mt-4 font-serif text-[#8d8177]">Connecting to artisan workshop...</p>
        </div>
      </div>
    );
  }

  if (error || !artisan) {
    return (
      <div className="min-h-screen bg-[#17120f] text-[#f5efe8]">
        <Navbar />
        <div className="mx-auto max-w-lg px-5 py-24 text-center">
          <h2 className="font-serif text-3xl">Artisan Profile Not Found</h2>
          <p className="mt-3 text-sm text-[#8d8177]">{error}</p>
          <Link
            to="/stories"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#d4af37] px-6 py-3 text-sm font-semibold text-[#17120f]"
          >
            <ArrowLeft size={16} /> Return to Stories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#17120f] text-[#f5efe8]">
      <Navbar />

      <main className="mx-auto max-w-[1400px] px-5 py-8 md:px-8 lg:py-12">
        {/* BACK LINK */}
        <Link
          to="/stories"
          className="group mb-8 inline-flex items-center gap-2 text-sm text-[#8d8177] transition hover:text-[#d4af37]"
        >
          <ArrowLeft size={16} className="transition group-hover:-translate-x-1" />
          Back to Artisan Stories
        </Link>

        {/* ARTISAN HERO BANNER */}
        <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#211b17] p-8 md:p-12 lg:p-16">
          {/* Subtle gold glow */}
          <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-[#d4af37]/5 blur-[120px]" />

          <div className="relative z-10 grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center">
            {/* PORTRAIT */}
            <div className="md:col-span-4 flex justify-center md:justify-start">
              <div className="relative h-48 w-48 sm:h-56 sm:w-56 overflow-hidden rounded-full border-4 border-[#d4af37]/30 shadow-2xl bg-[#2a211a]">
                {artisan.profileImage ? (
                  <img
                    src={artisan.profileImage}
                    alt={artisan.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[#d4af37]/40">
                    <User size={80} />
                  </div>
                )}
              </div>
            </div>

            {/* ARTISAN HEADER INFO */}
            <div className="md:col-span-8 text-center md:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#e7c85c]">
                <Sparkles size={12} />
                Master Craftsperson
              </div>

              <h1 className="mt-4 font-serif text-4xl font-normal text-[#f5efe8] md:text-5xl">
                {artisan.name}
              </h1>

              <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-[#c8bfb6]">
                {artisan.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={15} className="text-[#d4af37]" />
                    {artisan.location}
                  </span>
                )}
                {artisan.craft && (
                  <span className="rounded-full bg-white/[0.05] px-3 py-1 text-xs text-[#d4af37]">
                    {artisan.craft}
                  </span>
                )}
                {artisan.artForm && (
                  <span className="rounded-full bg-white/[0.05] px-3 py-1 text-xs text-[#c8bfb6]">
                    {artisan.artForm}
                  </span>
                )}
                {artisan.experience && (
                  <span className="flex items-center gap-1.5 text-xs text-[#e7c85c]">
                    <Award size={14} />
                    {artisan.experience} Years of Heritage Experience
                  </span>
                )}
              </div>

              {artisan.bio && (
                <p className="mt-5 text-base leading-relaxed text-[#c8bfb6] italic max-w-2xl">
                  "{artisan.bio}"
                </p>
              )}
            </div>
          </div>
        </section>

        {/* FULL ARTISAN STORY */}
        <section className="mt-12 rounded-3xl border border-white/[0.08] bg-[#1c1713] p-8 md:p-12">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center gap-2 text-[#d4af37] text-xs font-semibold uppercase tracking-[0.25em]">
              <BookOpen size={15} />
              The Artisan's Journey & Philosophy
            </div>

            <h2 className="mt-3 font-serif text-3xl text-[#f5efe8]">
              Preserving Tradition with Every Stroke
            </h2>

            <div className="mt-6 space-y-4 text-base leading-relaxed text-[#c8bfb6]">
              {artisan.story ? (
                <p className="whitespace-pre-line">{artisan.story}</p>
              ) : (
                <p>
                  {artisan.name} is dedicated to handcrafting heirloom treasures using traditional methods passed down through generations. When you acquire a piece from their studio, you are directly supporting their family and community.
                </p>
              )}
            </div>

            <div className="mt-8 rounded-2xl border border-[#d4af37]/20 bg-[#d4af37]/[0.03] p-6 text-sm text-[#d4af37] italic">
              "You are not just buying a product. You are honoring the person, dedication, and cultural heritage behind it."
            </div>
          </div>
        </section>

        {/* ARTISAN'S CREATIONS GRID */}
        <section className="mt-16">
          <div className="mb-8 flex items-end justify-between border-b border-white/[0.08] pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37]">
                Master Collection
              </span>
              <h2 className="mt-1 font-serif text-3xl text-[#f5efe8]">
                Creations by {artisan.name}
              </h2>
            </div>

            <p className="text-xs text-[#8d8177]">
              {products.length} {products.length === 1 ? "creation" : "creations"}
            </p>
          </div>

          {products.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/[0.08] bg-white/[0.02] p-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.04] text-[#8d8177]">
                <Package size={24} />
              </div>
              <h3 className="mt-4 font-serif text-2xl text-[#f5efe8]">
                No creations listed yet
              </h3>
              <p className="mt-2 text-sm text-[#8d8177]">
                This artisan is currently crafting new pieces in their workshop. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={{
                    ...product,
                    artistId: artisan
                  }}
                  onClick={() => navigate(`/products/${product._id}`)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ArtisanProfile;
