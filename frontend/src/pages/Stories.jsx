import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, MapPin, ArrowRight, User, BookOpen, Heart } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

const Stories = () => {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArtisans = async () => {
      setLoading(true);
      try {
        const response = await api.get("/auth/artisans");
        setArtisans(response.data.artisans || []);
      } catch (err) {
        console.error("Error fetching artisan stories:", err);
        setError("Failed to load artisan stories.");
      } finally {
        setLoading(false);
      }
    };

    fetchArtisans();
  }, []);

  return (
    <div className="min-h-screen bg-[#17120f] text-[#f5efe8]">
      <Navbar />

      {/* EDITORIAL HERO SECTION */}
      <section className="relative px-5 py-16 text-center md:py-24 overflow-hidden border-b border-white/[0.08]">
        {/* Glow accents */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-[#d4af37]/5 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#e7c85c]">
            <Sparkles size={13} />
            Heritage & Hands
          </span>

          <h1 className="mt-6 font-serif text-4xl leading-tight md:text-6xl text-[#f5efe8]">
            Stories Behind The <span className="text-[#d4af37]">Craft</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#c8bfb6] md:text-lg">
            Meet the master craftspeople who dedicate their lives to keeping India's centuries-old artistic traditions alive.
          </p>
        </div>
      </section>

      {/* STORIES GRID */}
      <main className="mx-auto max-w-[1400px] px-5 py-16 md:px-8">
        {loading && (
          <div className="flex min-h-[300px] flex-col items-center justify-center">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#d4af37]/20 border-t-[#d4af37]" />
            <p className="mt-4 text-sm text-[#8d8177]">Gathering artisan voices...</p>
          </div>
        )}

        {!loading && artisans.length === 0 && (
          <div className="rounded-3xl border border-dashed border-[#d4af37]/20 bg-white/[0.02] px-5 py-24 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#d4af37]/10 text-[#d4af37]">
              <BookOpen size={28} />
            </div>
            <h2 className="mt-6 font-serif text-3xl text-[#f5efe8]">Stories are coming soon.</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#8d8177]">
              Our artisan community is growing. Check back soon or explore the marketplace.
            </p>
            <Link
              to="/marketplace"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#d4af37] px-6 py-3 text-sm font-semibold text-[#17120f] transition hover:bg-[#e7c85c]"
            >
              Explore Marketplace
            </Link>
          </div>
        )}

        {!loading && artisans.length > 0 && (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {artisans.map((artisan) => (
              <div
                key={artisan._id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/[0.08] bg-[#211b17] transition-all duration-300 hover:-translate-y-2 hover:border-[#d4af37]/40 hover:shadow-[0_15px_40px_rgba(212,175,55,0.08)]"
              >
                <div>
                  {/* ARTISAN IMAGE */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#2d241e]">
                    {artisan.profileImage ? (
                      <img
                        src={artisan.profileImage}
                        alt={artisan.name}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[#d4af37]/40">
                        <User size={64} />
                      </div>
                    )}

                    {artisan.artForm && (
                      <span className="absolute top-4 left-4 rounded-full bg-[#17120f]/80 backdrop-blur-md px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#d4af37]">
                        {artisan.artForm}
                      </span>
                    )}

                    {artisan.experience && (
                      <span className="absolute bottom-4 right-4 rounded-full bg-[#17120f]/80 backdrop-blur-md px-3 py-1 text-[10px] font-medium text-[#c8bfb6]">
                        {artisan.experience} Years of Mastery
                      </span>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="p-7">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      {artisan.craft && (
                        <span className="font-semibold uppercase tracking-widest text-[#d4af37]">
                          {artisan.craft}
                        </span>
                      )}

                      {artisan.location && (
                        <span className="flex items-center gap-1 text-[#8d8177]">
                          <MapPin size={12} className="text-[#d4af37]" />
                          {artisan.location}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 font-serif text-2xl text-[#f5efe8] group-hover:text-[#e7c85c] transition-colors">
                      {artisan.name}
                    </h3>

                    {/* BIO / QUOTE */}
                    <p className="mt-4 text-sm leading-relaxed text-[#a69b91] italic line-clamp-3">
                      "{artisan.bio || artisan.story || "Every piece I make carries the timeless soul of my ancestral tradition."}"
                    </p>
                  </div>
                </div>

                {/* FOOTER ACTION */}
                <div className="border-t border-white/[0.06] p-7 pt-4">
                  <Link
                    to={`/artisans/${artisan._id}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#d4af37] transition group-hover:text-[#e7c85c]"
                  >
                    Read Story
                    <ArrowRight size={15} className="transition group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Stories;
