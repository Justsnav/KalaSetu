import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ShoppingBag,
    Palette,
    ArrowRight,
    Sparkles,
    Users,
    Globe,
    Shield,
} from "lucide-react";

import heroArt from "../assets/hero-art.jpg";

export default function LandingPage() {
    const features = [
        {
            icon: Sparkles,
            title: "Authentic Craft",
            desc: "Every product is handmade by verified artisans using traditional techniques.",
        },
        {
            icon: Users,
            title: "Direct Impact",
            desc: "Your purchase directly supports artisan families and their communities.",
        },
        {
            icon: Globe,
            title: "Cultural Heritage",
            desc: "Preserving India's cultural heritage — one craft at a time.",
        },
        {
            icon: Shield,
            title: "Quality Assured",
            desc: "Each piece is curated for quality, authenticity, and artisanal excellence.",
        },
    ];

    const buyerSteps = [
        "Create an account and join KalaSetu",
        "Browse curated collections from master artisans",
        "Add your favorite creations to your cart",
        "Discover the stories behind every artwork",
        "Support artisan communities with every purchase",
    ];

    const artisanSteps = [
        "Register as an artisan with your craft details",
        "Create your personal artisan profile",
        "Add products with images, pricing and stock information",
        "Your creations become available to buyers",
        "Manage and grow your handmade business",
    ];

    return (
        <div className="min-h-screen overflow-hidden bg-[#1c1713] text-[#f5efe8]">

            {/* ================= HERO SECTION ================= */}
            <section className="relative flex min-h-screen items-center justify-center">

                {/* Background Image */}
                <div
                    className="absolute inset-0 opacity-25"
                    style={{
                        backgroundImage: `url(${heroArt})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#1c1713]/60 via-[#1c1713]/85 to-[#1c1713]" />

                {/* Decorative Glow */}
                <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-[#d4af37]/10 blur-[120px]" />

                <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-[#d4af37]/10 blur-[100px]" />

                {/* Main Content */}
                <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">

                    {/* Hero Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 1,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                    >
                        <span className="mb-6 inline-block rounded-full border border-[#d4af37]/30 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-[#d4af37] md:text-sm">
                            Handcrafted with Soul
                        </span>

                        <h1 className="mb-8 font-serif text-6xl leading-[0.95] md:text-8xl lg:text-9xl">
                            <span className="text-[#f5efe8]">
                                Kala
                            </span>

                            <span className="text-[#d4af37]">
                                Setu
                            </span>
                        </h1>

                        <p className="mx-auto mb-4 max-w-2xl text-lg leading-relaxed text-[#c8bfb6] md:text-xl">
                            Bridging the gap between India's timeless artisan
                            heritage and the modern world.
                        </p>

                        <p className="mx-auto mb-12 max-w-lg text-sm text-[#8d8177]">
                            A marketplace where master craftspeople showcase
                            timeless traditions, and buyers discover authentic
                            handmade treasures.
                        </p>
                    </motion.div>


                    {/* ================= ROLE BUTTONS ================= */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.3,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                        className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
                    >

                        {/* BUYER */}
                        <Link
                            to="/auth"
                            state={{ preferredRole: "buyer" }}
                            className="group relative w-full sm:w-auto"
                        >
                            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.07] px-8 py-4 backdrop-blur-xl transition-all duration-300 hover:border-[#d4af37]/40 hover:bg-white/[0.12] hover:shadow-[0_0_30px_rgba(212,175,55,0.1)]">

                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d4af37]/15">
                                    <ShoppingBag
                                        size={18}
                                        className="text-[#d4af37]"
                                    />
                                </div>

                                <div className="text-left">
                                    <p className="text-sm font-medium text-[#f5efe8]">
                                        Shop as Buyer
                                    </p>

                                    <p className="text-xs text-[#8d8177]">
                                        Browse & buy handcrafted goods
                                    </p>
                                </div>

                                <ArrowRight
                                    size={16}
                                    className="ml-2 text-[#8d8177] transition-all group-hover:translate-x-1 group-hover:text-[#d4af37]"
                                />
                            </div>
                        </Link>


                        {/* ARTISAN */}
                        <Link
                            to="/auth"
                            state={{ preferredRole: "artisan" }}
                            className="group relative w-full sm:w-auto"
                        >
                            <div className="flex items-center gap-3 rounded-lg border border-[#d4af37]/25 bg-[#d4af37]/10 px-8 py-4 backdrop-blur-xl transition-all duration-300 hover:border-[#d4af37]/50 hover:bg-[#d4af37]/15 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]">

                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d4af37]/20">
                                    <Palette
                                        size={18}
                                        className="text-[#d4af37]"
                                    />
                                </div>

                                <div className="text-left">
                                    <p className="text-sm font-medium text-[#e7c85c]">
                                        Join as Artisan
                                    </p>

                                    <p className="text-xs text-[#b8aca1]">
                                        Sell your handmade creations
                                    </p>
                                </div>

                                <ArrowRight
                                    size={16}
                                    className="ml-2 text-[#b8aca1] transition-all group-hover:translate-x-1 group-hover:text-[#e7c85c]"
                                />
                            </div>
                        </Link>
                    </motion.div>


                    {/* ================= SCROLL INDICATOR ================= */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2"
                    >
                        <div className="flex h-8 w-5 items-start justify-center rounded-full border-2 border-[#554a42] p-1">
                            <motion.div
                                animate={{ y: [0, 8, 0] }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 1.5,
                                }}
                                className="h-1.5 w-1 rounded-full bg-[#d4af37]"
                            />
                        </div>
                    </motion.div>

                </div>
            </section>


            {/* ================= WHY KALASETU ================= */}
            <section className="relative py-24">

                <div className="absolute inset-0 bg-gradient-to-b from-[#1c1713] via-[#292018] to-[#1c1713]" />

                <div className="relative z-10 mx-auto max-w-6xl px-4">

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="mb-16 text-center"
                    >
                        <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#d4af37]">
                            Why KalaSetu
                        </span>

                        <h2 className="mt-3 font-serif text-3xl text-[#f5efe8] md:text-5xl">
                            The Art Bridge
                        </h2>
                    </motion.div>


                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">

                        {features.map((feature, index) => {
                            const Icon = feature.icon;

                            return (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 25 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        delay: index * 0.1,
                                        duration: 0.5,
                                    }}
                                    className="rounded-lg border border-white/[0.06] bg-white/[0.04] p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:bg-white/[0.07]"
                                >
                                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#d4af37]/10">
                                        <Icon
                                            size={18}
                                            className="text-[#d4af37]"
                                        />
                                    </div>

                                    <h3 className="mb-2 font-serif text-lg text-[#f5efe8]">
                                        {feature.title}
                                    </h3>

                                    <p className="text-sm leading-relaxed text-[#a69b91]">
                                        {feature.desc}
                                    </p>
                                </motion.div>
                            );
                        })}

                    </div>
                </div>
            </section>


            {/* ================= HOW IT WORKS ================= */}
            <section className="relative py-24">

                <div className="absolute inset-0 bg-[#1c1713]" />

                <div className="relative z-10 mx-auto max-w-5xl px-4">

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-16 text-center"
                    >
                        <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#d4af37]">
                            How It Works
                        </span>

                        <h2 className="mt-3 font-serif text-3xl text-[#f5efe8] md:text-5xl">
                            Two Paths, One Mission
                        </h2>
                    </motion.div>


                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

                        {/* BUYER PATH */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-8"
                        >
                            <div className="mb-6 flex items-center gap-3">

                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2d261f]">
                                    <ShoppingBag
                                        size={20}
                                        className="text-[#d4af37]"
                                    />
                                </div>

                                <div>
                                    <h3 className="font-serif text-xl text-[#f5efe8]">
                                        For Buyers
                                    </h3>

                                    <p className="text-xs text-[#8d8177]">
                                        Discover handcrafted treasures
                                    </p>
                                </div>
                            </div>


                            <div className="space-y-4">
                                {buyerSteps.map((step, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3"
                                    >
                                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d4af37]/15 text-xs font-semibold text-[#d4af37]">
                                            {index + 1}
                                        </span>

                                        <p className="text-sm text-[#c8bfb6]">
                                            {step}
                                        </p>
                                    </div>
                                ))}
                            </div>


                            <Link
                                to="/auth"
                                state={{ preferredRole: "buyer" }}
                                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#d4af37] transition-colors hover:text-[#e7c85c]"
                            >
                                Start Shopping

                                <ArrowRight size={14} />
                            </Link>
                        </motion.div>


                        {/* ARTISAN PATH */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="rounded-xl border border-[#d4af37]/15 bg-[#d4af37]/[0.04] p-8"
                        >
                            <div className="mb-6 flex items-center gap-3">

                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d4af37]/15">
                                    <Palette
                                        size={20}
                                        className="text-[#d4af37]"
                                    />
                                </div>

                                <div>
                                    <h3 className="font-serif text-xl text-[#e7c85c]">
                                        For Artisans
                                    </h3>

                                    <p className="text-xs text-[#8d8177]">
                                        Showcase your craft to the world
                                    </p>
                                </div>
                            </div>


                            <div className="space-y-4">
                                {artisanSteps.map((step, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3"
                                    >
                                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d4af37]/20 text-xs font-semibold text-[#d4af37]">
                                            {index + 1}
                                        </span>

                                        <p className="text-sm text-[#c8bfb6]">
                                            {step}
                                        </p>
                                    </div>
                                ))}
                            </div>


                            <Link
                                to="/auth"
                                state={{ preferredRole: "artisan" }}
                                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#d4af37] transition-colors hover:text-[#e7c85c]"
                            >
                                Start Selling

                                <ArrowRight size={14} />
                            </Link>
                        </motion.div>

                    </div>
                </div>
            </section>


            {/* ================= FINAL CTA ================= */}
            <section className="relative py-20">

                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1713] to-[#292018]" />

                <div className="absolute inset-0">
                    <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4af37]/5 blur-[150px]" />
                </div>


                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative z-10 mx-auto max-w-2xl px-4 text-center"
                >
                    <h2 className="mb-4 font-serif text-3xl text-[#f5efe8] md:text-5xl">
                        Ready to begin?
                    </h2>

                    <p className="mb-8 text-[#a69b91]">
                        Join talented artisans and conscious buyers building a
                        brighter future for Indian craftsmanship.
                    </p>


                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">

                        <Link
                            to="/auth"
                            className="rounded-sm bg-[#d4af37] px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-[#1c1713] transition-colors hover:bg-[#e7c85c]"
                        >
                            Get Started
                        </Link>


                        <Link
                            to="/marketplace"
                            className="rounded-sm border border-[#554a42] px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-[#c8bfb6] transition-colors hover:border-[#8d8177] hover:text-[#f5efe8]"
                        >
                            Explore First
                        </Link>

                    </div>
                </motion.div>
            </section>
        </div>
    );
}