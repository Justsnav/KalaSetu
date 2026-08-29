import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    Eye,
    EyeOff,
    Palette,
    ShoppingBag,
    User,
    Mail,
    Lock,
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const AuthPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();

    // Role coming from LandingPage
    const preferredRole = location.state?.preferredRole || "buyer";

    const [role, setRole] = useState(preferredRole);
    const [isLogin, setIsLogin] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =========================
    // HANDLE INPUT CHANGE
    // =========================

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setError("");
        setSuccess("");
    };

    // =========================
    // HANDLE FORM SUBMIT
    // =========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // Signup validation
        if (!isLogin) {
            if (formData.password !== formData.confirmPassword) {
                setError("Passwords do not match.");
                return;
            }

            if (formData.password.length < 6) {
                setError("Password must be at least 6 characters.");
                return;
            }
        }

        setLoading(true);

        try {
            let response;

            if (!isLogin) {
                // SIGNUP
                response = await api.post("/auth/signup", {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: role,
                });
            } else {
                // LOGIN
                response = await api.post("/auth/login", {
                    email: formData.email,
                    password: formData.password,
                });
            }

            const token = response.data.token;

            // Save token first — the axios interceptor reads it from
            // localStorage on every request, so /auth/me needs it saved already.
            localStorage.setItem("token", token);

            // Now fetch the real, logged-in user (includes their actual role)
            const meResponse = await api.get("/auth/me");
            const user = meResponse.data.user;

            // Update shared auth state across the whole app
            login(user, token);

            setSuccess(
                isLogin ? "Login successful!" : "Account created successfully!"
            );

            if (!isLogin) {
                // Clear form after signup, then switch to login tab
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                });

                setTimeout(() => {
                    setIsLogin(true);
                    setSuccess("");
                }, 1200);
            } else {
                // Redirect based on the REAL role from the backend,
                // not the `role` toggle state
                setTimeout(() => {
                    if (user.role === "artisan") {
                        navigate("/artisan/dashboard");
                    } else {
                        navigate("/buyer/dashboard");
                    }
                }, 1000);
            }
        } catch (err) {
            console.error("Authentication error:", err);
            setError(
                err.response?.data?.message || "Unable to connect to the server."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#1c1713] text-[#f5efe8]">
            {/* ================= HEADER ================= */}
            <header className="flex h-[78px] items-center justify-between border-b border-white/[0.07] px-6 md:px-12">
                <button
                    onClick={() => navigate("/")}
                    className="group flex items-center gap-2 text-sm text-[#a69b91] transition hover:text-[#d4af37]"
                >
                    <ArrowLeft
                        size={17}
                        className="transition group-hover:-translate-x-1"
                    />
                    Back
                </button>

                <Link
                    to="/"
                    className="font-serif text-3xl font-semibold tracking-tight"
                >
                    Kala<span className="text-[#d4af37]">Setu</span>
                </Link>

                <div className="w-[60px]" />
            </header>

            {/* ================= MAIN ================= */}
            <main className="relative flex min-h-[calc(100vh-78px)] items-center justify-center overflow-hidden px-4 py-12">
                {/* Background Glow */}
                <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-[#d4af37]/5 blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#d4af37]/5 blur-[120px]" />

                {/* ================= AUTH CONTAINER ================= */}
                <div className="relative z-10 w-full max-w-[460px]">
                    {/* Heading */}
                    <div className="mb-8 text-center">
                        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[#d4af37]">
                            {isLogin ? "Welcome Back" : "Join KalaSetu"}
                        </p>

                        <h1 className="font-serif text-4xl text-[#f5efe8] md:text-5xl">
                            {isLogin ? "Welcome back." : "Begin your journey."}
                        </h1>

                        <p className="mt-3 text-sm text-[#8d8177]">
                            {isLogin
                                ? "Sign in to continue your KalaSetu journey."
                                : "Become part of India's growing artisan community."}
                        </p>
                    </div>

                    {/* ================= CARD ================= */}
                    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl md:p-8">
                        {/* ================= ROLE ================= */}
                        <div className="mb-7">
                            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[#8d8177]">
                                Continue as
                            </p>

                            <div className="grid grid-cols-2 gap-3">
                                {/* Buyer */}
                                <button
                                    type="button"
                                    onClick={() => setRole("buyer")}
                                    className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm transition-all ${
                                        role === "buyer"
                                            ? "border-[#d4af37]/50 bg-[#d4af37]/10 text-[#e7c85c]"
                                            : "border-white/[0.08] bg-white/[0.02] text-[#8d8177] hover:border-white/20"
                                    }`}
                                >
                                    <ShoppingBag size={17} />
                                    Buyer
                                </button>

                                {/* Artisan */}
                                <button
                                    type="button"
                                    onClick={() => setRole("artisan")}
                                    className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm transition-all ${
                                        role === "artisan"
                                            ? "border-[#d4af37]/50 bg-[#d4af37]/10 text-[#e7c85c]"
                                            : "border-white/[0.08] bg-white/[0.02] text-[#8d8177] hover:border-white/20"
                                    }`}
                                >
                                    <Palette size={17} />
                                    Artisan
                                </button>
                            </div>
                        </div>

                        {/* ================= LOGIN / SIGNUP ================= */}
                        <div className="mb-7 flex border-b border-white/[0.08]">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLogin(false);
                                    setError("");
                                    setSuccess("");
                                }}
                                className={`flex-1 border-b-2 pb-3 text-sm transition ${
                                    !isLogin
                                        ? "border-[#d4af37] text-[#e7c85c]"
                                        : "border-transparent text-[#8d8177]"
                                }`}
                            >
                                Create Account
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsLogin(true);
                                    setError("");
                                    setSuccess("");
                                }}
                                className={`flex-1 border-b-2 pb-3 text-sm transition ${
                                    isLogin
                                        ? "border-[#d4af37] text-[#e7c85c]"
                                        : "border-transparent text-[#8d8177]"
                                }`}
                            >
                                Login
                            </button>
                        </div>

                        {/* ================= ERROR ================= */}
                        {error && (
                            <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                {error}
                            </div>
                        )}

                        {/* ================= SUCCESS ================= */}
                        {success && (
                            <div className="mb-5 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                                {success}
                            </div>
                        )}

                        {/* ================= FORM ================= */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* NAME */}
                            {!isLogin && (
                                <div>
                                    <label className="mb-2 block text-xs text-[#a69b91]">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User
                                            size={17}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6e635b]"
                                        />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your name"
                                            required
                                            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] py-3.5 pl-11 pr-4 text-sm text-[#f5efe8] outline-none placeholder:text-[#625950] transition focus:border-[#d4af37]/50 focus:bg-white/[0.06]"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* EMAIL */}
                            <div>
                                <label className="mb-2 block text-xs text-[#a69b91]">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail
                                        size={17}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6e635b]"
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        required
                                        className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] py-3.5 pl-11 pr-4 text-sm text-[#f5efe8] outline-none placeholder:text-[#625950] transition focus:border-[#d4af37]/50 focus:bg-white/[0.06]"
                                    />
                                </div>
                            </div>

                            {/* PASSWORD */}
                            <div>
                                <label className="mb-2 block text-xs text-[#a69b91]">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        size={17}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6e635b]"
                                    />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                        required
                                        className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] py-3.5 pl-11 pr-12 text-sm text-[#f5efe8] outline-none placeholder:text-[#625950] transition focus:border-[#d4af37]/50 focus:bg-white/[0.06]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6e635b] hover:text-[#d4af37]"
                                    >
                                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                    </button>
                                </div>
                            </div>

                            {/* CONFIRM PASSWORD */}
                            {!isLogin && (
                                <div>
                                    <label className="mb-2 block text-xs text-[#a69b91]">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <Lock
                                            size={17}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6e635b]"
                                        />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="Confirm your password"
                                            required
                                            className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] py-3.5 pl-11 pr-12 text-sm text-[#f5efe8] outline-none placeholder:text-[#625950] transition focus:border-[#d4af37]/50 focus:bg-white/[0.06]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(!showConfirmPassword)
                                            }
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6e635b] hover:text-[#d4af37]"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff size={17} />
                                            ) : (
                                                <Eye size={17} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* FORGOT PASSWORD */}
                            {isLogin && (
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        className="text-xs text-[#d4af37] hover:text-[#e7c85c]"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            )}

                            {/* SUBMIT BUTTON */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#d4af37] py-3.5 text-sm font-semibold text-[#1c1713] transition hover:bg-[#e7c85c] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    "Please wait..."
                                ) : (
                                    <>
                                        {isLogin
                                            ? "Login"
                                            : `Create ${
                                                  role === "artisan" ? "Artisan" : "Buyer"
                                              } Account`}
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* ================= SWITCH ================= */}
                        <p className="mt-7 text-center text-xs text-[#8d8177]">
                            {isLogin
                                ? "Don't have an account?"
                                : "Already have an account?"}
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setError("");
                                    setSuccess("");
                                }}
                                className="ml-1 text-[#d4af37] hover:text-[#e7c85c]"
                            >
                                {isLogin ? "Create one" : "Login"}
                            </button>
                        </p>
                    </div>

                    {/* Footer */}
                    <p className="mt-6 text-center text-[11px] text-[#625950]">
                        By continuing, you agree to KalaSetu's Terms of Service and
                        Privacy Policy.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default AuthPage;