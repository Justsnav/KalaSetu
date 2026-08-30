import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
  ShoppingBag,
  User,
  Menu,
  X,
  Package,
  Plus,
  BookOpen,
  LogOut,
  LayoutDashboard,
  Compass,
  ClipboardList
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  const isArtisan = user?.role === "artisan";
  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#17120f]/95 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-[76px] max-w-[1400px] items-center justify-between px-5 md:px-8">
        
        {/* LOGO */}
        <Link
          to={isArtisan ? "/artisan/dashboard" : "/"}
          className="flex items-center gap-2 font-serif text-2xl tracking-tight text-[#f5efe8] transition hover:opacity-90 md:text-3xl"
        >
          <span>Kala</span>
          <span className="text-[#d4af37]">Setu</span>
          {isArtisan && (
            <span className="ml-2 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-2.5 py-0.5 text-[10px] font-sans uppercase tracking-widest text-[#e7c85c]">
              Artisan
            </span>
          )}
        </Link>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden items-center gap-8 text-sm md:flex">
          {isArtisan ? (
            <>
              <Link
                to="/artisan/dashboard"
                className={`flex items-center gap-1.5 transition ${
                  isActive("/artisan/dashboard")
                    ? "text-[#d4af37] font-medium"
                    : "text-[#a69b91] hover:text-[#f5efe8]"
                }`}
              >
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/add-product"
                className={`flex items-center gap-1.5 transition ${
                  isActive("/add-product")
                    ? "text-[#d4af37] font-medium"
                    : "text-[#a69b91] hover:text-[#f5efe8]"
                }`}
              >
                <Plus size={16} />
                <span>Add Product</span>
              </Link>

              <Link
                to="/artisan/orders"
                className={`flex items-center gap-1.5 transition ${
                  isActive("/artisan/orders")
                    ? "text-[#d4af37] font-medium"
                    : "text-[#a69b91] hover:text-[#f5efe8]"
                }`}
              >
                <ClipboardList size={16} />
                <span>Orders</span>
              </Link>

              <Link
                to="/stories"
                className={`flex items-center gap-1.5 transition ${
                  isActive("/stories")
                    ? "text-[#d4af37] font-medium"
                    : "text-[#a69b91] hover:text-[#f5efe8]"
                }`}
              >
                <BookOpen size={16} />
                <span>Stories</span>
              </Link>

              <Link
                to="/marketplace"
                className={`flex items-center gap-1.5 transition ${
                  isActive("/marketplace")
                    ? "text-[#d4af37] font-medium"
                    : "text-[#a69b91] hover:text-[#f5efe8]"
                }`}
              >
                <Compass size={16} />
                <span>Marketplace</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/marketplace"
                className={`transition ${
                  isActive("/marketplace")
                    ? "text-[#d4af37] font-medium"
                    : "text-[#a69b91] hover:text-[#f5efe8]"
                }`}
              >
                Explore
              </Link>

              <Link
                to="/stories"
                className={`transition ${
                  isActive("/stories")
                    ? "text-[#d4af37] font-medium"
                    : "text-[#a69b91] hover:text-[#f5efe8]"
                }`}
              >
                Stories
              </Link>

              {user && (
                <Link
                  to="/orders"
                  className={`transition ${
                    isActive("/orders")
                      ? "text-[#d4af37] font-medium"
                      : "text-[#a69b91] hover:text-[#f5efe8]"
                  }`}
                >
                  My Orders
                </Link>
              )}
            </>
          )}
        </nav>

        {/* DESKTOP RIGHT ACTIONS */}
        <div className="hidden items-center gap-4 md:flex">
          {!isArtisan && (
            <Link
              to="/cart"
              className="relative flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-[#f5efe8] transition hover:border-[#d4af37]/40 hover:bg-white/[0.06]"
            >
              <ShoppingBag size={17} className="text-[#d4af37]" />
              <span>Cart</span>
              {totalItems > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#d4af37] text-[11px] font-bold text-[#17120f]">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className={`flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-[#f5efe8] transition hover:border-[#d4af37]/40 ${
                  isActive("/profile") ? "border-[#d4af37]/50 bg-[#d4af37]/10" : ""
                }`}
              >
                <User size={16} className="text-[#d4af37]" />
                <span className="max-w-[120px] truncate">{user.name}</span>
              </Link>

              <button
                onClick={handleLogout}
                title="Logout"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] text-[#8d8177] transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="rounded-lg bg-[#d4af37] px-6 py-2.5 text-sm font-semibold text-[#17120f] shadow-md transition duration-200 hover:bg-[#e7c85c]"
            >
              Login / Join
            </Link>
          )}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="flex items-center gap-3 md:hidden">
          {!isArtisan && (
            <Link
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-[#f5efe8]"
            >
              <ShoppingBag size={18} className="text-[#d4af37]" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#d4af37] text-[10px] font-bold text-[#17120f]">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] text-[#f5efe8]"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="border-b border-white/[0.08] bg-[#1c1713] px-5 py-6 md:hidden">
          <nav className="flex flex-col space-y-4 text-sm">
            {isArtisan ? (
              <>
                <Link
                  to="/artisan/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-2 text-[#f5efe8]"
                >
                  <LayoutDashboard size={18} className="text-[#d4af37]" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/add-product"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-2 text-[#f5efe8]"
                >
                  <Plus size={18} className="text-[#d4af37]" />
                  <span>Add Product</span>
                </Link>

                <Link
                  to="/artisan/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-2 text-[#f5efe8]"
                >
                  <ClipboardList size={18} className="text-[#d4af37]" />
                  <span>Orders</span>
                </Link>

                <Link
                  to="/stories"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-2 text-[#f5efe8]"
                >
                  <BookOpen size={18} className="text-[#d4af37]" />
                  <span>Artisan Stories</span>
                </Link>

                <Link
                  to="/marketplace"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-2 text-[#f5efe8]"
                >
                  <Compass size={18} className="text-[#d4af37]" />
                  <span>Marketplace</span>
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-2 text-[#f5efe8]"
                >
                  <User size={18} className="text-[#d4af37]" />
                  <span>Profile & Settings</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 py-2 text-left text-red-400"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/marketplace"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-2 text-[#f5efe8]"
                >
                  <Compass size={18} className="text-[#d4af37]" />
                  <span>Explore Marketplace</span>
                </Link>

                <Link
                  to="/stories"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-2 text-[#f5efe8]"
                >
                  <BookOpen size={18} className="text-[#d4af37]" />
                  <span>Artisan Stories</span>
                </Link>

                {user && (
                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-2 text-[#f5efe8]"
                  >
                    <Package size={18} className="text-[#d4af37]" />
                    <span>My Orders</span>
                  </Link>
                )}

                <Link
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 text-[#f5efe8]"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag size={18} className="text-[#d4af37]" />
                    <span>Cart</span>
                  </div>
                  {totalItems > 0 && (
                    <span className="rounded-full bg-[#d4af37] px-2 py-0.5 text-xs font-bold text-[#17120f]">
                      {totalItems}
                    </span>
                  )}
                </Link>

                {user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 py-2 text-[#f5efe8]"
                    >
                      <User size={18} className="text-[#d4af37]" />
                      <span>Profile ({user.name})</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 py-2 text-left text-red-400"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mt-2 block rounded-lg bg-[#d4af37] py-3 text-center font-semibold text-[#17120f]"
                  >
                    Login / Join KalaSetu
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
