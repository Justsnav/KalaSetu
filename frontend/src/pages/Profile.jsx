import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  MapPin,
  Sparkles,
  Award,
  BookOpen,
  Save,
  CheckCircle,
  AlertCircle,
  LogOut,
  Phone,
  Home
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'security'

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    profileImage: user?.profileImage || "",
    location: user?.location || "",
    craft: user?.craft || "",
    artForm: user?.artForm || "",
    bio: user?.bio || "",
    story: user?.story || "",
    experience: user?.experience || "",
    phone: user?.phone || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    pincode: user?.address?.pincode || ""
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
    setProfileSuccess("");
    setProfileError("");
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setPasswordSuccess("");
    setPasswordError("");
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess("");
    setProfileError("");

    try {
      const payload = {
        name: profileData.name,
        profileImage: profileData.profileImage,
        location: profileData.location,
        craft: profileData.craft,
        artForm: profileData.artForm,
        bio: profileData.bio,
        story: profileData.story,
        experience: profileData.experience,
        phone: profileData.phone,
        address: {
          street: profileData.street,
          city: profileData.city,
          state: profileData.state,
          pincode: profileData.pincode
        }
      };

      const response = await api.patch("/auth/profile", payload);
      if (response.data?.user) {
        updateUser(response.data.user);
      }
      setProfileSuccess("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update error:", err);
      setProfileError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordSuccess("");
    setPasswordError("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match.");
      setPasswordLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      setPasswordLoading(false);
      return;
    }

    try {
      await api.patch("/auth/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });

      setPasswordSuccess("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error("Change password error:", err);
      setPasswordError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isArtisan = user?.role === "artisan";

  return (
    <div className="min-h-screen bg-[#17120f] text-[#f5efe8]">
      <Navbar />

      <main className="mx-auto max-w-[1100px] px-5 py-8 md:px-8 lg:py-12">
        {/* PROFILE HEADER */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-[#d4af37]/40 bg-[#2a211a] flex items-center justify-center">
              {profileData.profileImage ? (
                <img
                  src={profileData.profileImage}
                  alt={user?.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User size={30} className="text-[#d4af37]" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl md:text-3xl text-[#f5efe8]">
                  {user?.name}
                </h1>
                <span className="rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#e7c85c]">
                  {user?.role}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-[#8d8177]">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/10 hover:border-red-500/30"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>

        {/* TABS */}
        <div className="mb-8 flex border-b border-white/[0.08]">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 border-b-2 px-6 pb-3 text-sm font-medium transition ${
              activeTab === "profile"
                ? "border-[#d4af37] text-[#e7c85c]"
                : "border-transparent text-[#8d8177] hover:text-[#f5efe8]"
            }`}
          >
            <User size={16} />
            Personal & Workshop Info
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2 border-b-2 px-6 pb-3 text-sm font-medium transition ${
              activeTab === "security"
                ? "border-[#d4af37] text-[#e7c85c]"
                : "border-transparent text-[#8d8177] hover:text-[#f5efe8]"
            }`}
          >
            <Lock size={16} />
            Security & Password
          </button>
        </div>

        {/* =========================================================
            TAB 1: PERSONAL & ARTISAN PROFILE
        ========================================================= */}
        {activeTab === "profile" && (
          <div className="rounded-3xl border border-white/[0.08] bg-[#211b17] p-6 md:p-10 shadow-xl">
            <h2 className="font-serif text-2xl text-[#f5efe8] border-b border-white/[0.06] pb-4">
              {isArtisan ? "Artisan Story & Details" : "Account Information"}
            </h2>

            {profileSuccess && (
              <div className="mt-6 flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-xs text-green-300">
                <CheckCircle size={16} />
                <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-300">
                <AlertCircle size={16} />
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#8d8177] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    required
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-sm text-[#f5efe8] outline-none focus:border-[#d4af37]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#8d8177] mb-2">
                    Profile Image URL
                  </label>
                  <input
                    type="url"
                    name="profileImage"
                    value={profileData.profileImage}
                    onChange={handleProfileChange}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-sm text-[#f5efe8] outline-none focus:border-[#d4af37]/50"
                  />
                </div>
              </div>

              {/* ARTISAN SPECIFIC FIELDS */}
              {isArtisan && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-[#8d8177] mb-2">
                        Location / Region
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={profileData.location}
                        onChange={handleProfileChange}
                        placeholder="e.g. Jaipur, Rajasthan"
                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-sm text-[#f5efe8] outline-none focus:border-[#d4af37]/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-[#8d8177] mb-2">
                        Craft Specialization
                      </label>
                      <input
                        type="text"
                        name="craft"
                        value={profileData.craft}
                        onChange={handleProfileChange}
                        placeholder="e.g. Blue Pottery, Pashmina"
                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-sm text-[#f5efe8] outline-none focus:border-[#d4af37]/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-[#8d8177] mb-2">
                        Years of Experience
                      </label>
                      <input
                        type="text"
                        name="experience"
                        value={profileData.experience}
                        onChange={handleProfileChange}
                        placeholder="e.g. 24"
                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-sm text-[#f5efe8] outline-none focus:border-[#d4af37]/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#8d8177] mb-2">
                      Art Form
                    </label>
                    <input
                      type="text"
                      name="artForm"
                      value={profileData.artForm}
                      onChange={handleProfileChange}
                      placeholder="e.g. Terracotta, Madhubani Painting, Wood Carving"
                      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-sm text-[#f5efe8] outline-none focus:border-[#d4af37]/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#8d8177] mb-2">
                      Short Bio / Tagline Quote
                    </label>
                    <input
                      type="text"
                      name="bio"
                      value={profileData.bio}
                      onChange={handleProfileChange}
                      placeholder="e.g. Every piece I make carries the timeless soul of my village."
                      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-sm text-[#f5efe8] outline-none focus:border-[#d4af37]/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#8d8177] mb-2">
                      Full Artisan Heritage Story
                    </label>
                    <textarea
                      rows={5}
                      name="story"
                      value={profileData.story}
                      onChange={handleProfileChange}
                      placeholder="Tell buyers about your heritage, your family tradition, the techniques you use, and what makes your craft unique..."
                      className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-sm text-[#f5efe8] outline-none focus:border-[#d4af37]/50"
                    />
                  </div>
                </>
              )}

              {/* BUYER SHIPPING DETAILS */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#d4af37] border-t border-white/[0.06] pt-6 mb-4">
                  Contact & Default Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#8d8177] mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-sm text-[#f5efe8] outline-none focus:border-[#d4af37]/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#8d8177] mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={profileData.street}
                      onChange={handleProfileChange}
                      placeholder="Flat, Road / Area"
                      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-sm text-[#f5efe8] outline-none focus:border-[#d4af37]/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-[#8d8177] mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={profileData.city}
                      onChange={handleProfileChange}
                      placeholder="City"
                      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-sm text-[#f5efe8] outline-none focus:border-[#d4af37]/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-[#8d8177] mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={profileData.state}
                        onChange={handleProfileChange}
                        placeholder="State"
                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-sm text-[#f5efe8] outline-none focus:border-[#d4af37]/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium uppercase tracking-wider text-[#8d8177] mb-2">
                        Pincode
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={profileData.pincode}
                        onChange={handleProfileChange}
                        placeholder="Pincode"
                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-sm text-[#f5efe8] outline-none focus:border-[#d4af37]/50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#d4af37] px-8 py-3.5 text-sm font-semibold text-[#17120f] shadow-lg transition hover:bg-[#e7c85c]"
                >
                  <Save size={16} />
                  {profileLoading ? "Saving Changes..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =========================================================
            TAB 2: SECURITY & CHANGE PASSWORD
        ========================================================= */}
        {activeTab === "security" && (
          <div className="max-w-xl rounded-3xl border border-white/[0.08] bg-[#211b17] p-6 md:p-10 shadow-xl">
            <h2 className="font-serif text-2xl text-[#f5efe8] border-b border-white/[0.06] pb-4">
              Change Password
            </h2>

            {passwordSuccess && (
              <div className="mt-6 flex items-center gap-3 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-xs text-green-300">
                <CheckCircle size={16} />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-300">
                <AlertCircle size={16} />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="mt-6 space-y-5">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#8d8177] mb-2">
                  Current Password *
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Enter current password"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-sm text-[#f5efe8] outline-none focus:border-[#d4af37]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#8d8177] mb-2">
                  New Password (min. 6 characters) *
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-sm text-[#f5efe8] outline-none focus:border-[#d4af37]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#8d8177] mb-2">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Confirm new password"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-sm text-[#f5efe8] outline-none focus:border-[#d4af37]/50"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#d4af37] px-8 py-3.5 text-sm font-semibold text-[#17120f] shadow-lg transition hover:bg-[#e7c85c]"
                >
                  <Lock size={16} />
                  {passwordLoading ? "Updating Password..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
