import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Box,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "Pottery",
    artForm: "",
    price: "",
    stock: "1",
    imageUrl: "",
    additionalImages: "",
    material: "",
    height: "",
    width: "",
    depth: "",
    unit: "cm",
    description: "",
    story: "",
    model3DEnabled: false,
    glbUrl: "",
    usdzUrl: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get(`/products/${id}`);
        const p = response.data.product;

        const images = Array.isArray(p.image) ? p.image : (p.image ? [p.image] : []);
        const primaryImg = images[0] || "";
        const extraImgs = images.slice(1).join(", ");

        setFormData({
          title: p.title || "",
          category: p.category || "Pottery",
          artForm: p.artForm || "",
          price: p.price ? String(p.price) : "",
          stock: p.stock !== undefined ? String(p.stock) : "1",
          imageUrl: primaryImg,
          additionalImages: extraImgs,
          material: Array.isArray(p.material) ? p.material.join(", ") : (p.material || ""),
          height: p.dimensions?.height || "",
          width: p.dimensions?.width || "",
          depth: p.dimensions?.depth || "",
          unit: p.dimensions?.unit || "cm",
          description: p.description || "",
          story: p.story || "",
          model3DEnabled: !!p.model3D?.enabled,
          glbUrl: p.model3D?.glbUrl || "",
          usdzUrl: p.model3D?.usdzUrl || ""
        });
      } catch (err) {
        console.error("Error loading product for edit:", err);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title || !formData.price || !formData.category) {
      setError("Please fill out the title, category, and price.");
      return;
    }

    setSaving(true);

    try {
      const images = [];
      if (formData.imageUrl.trim()) images.push(formData.imageUrl.trim());
      if (formData.additionalImages.trim()) {
        const extra = formData.additionalImages.split(",").map(url => url.trim()).filter(Boolean);
        images.push(...extra);
      }

      const materials = formData.material.trim()
        ? formData.material.split(",").map(m => m.trim()).filter(Boolean)
        : [];

      const payload = {
        title: formData.title,
        category: formData.category,
        artForm: formData.artForm,
        price: Number(formData.price),
        stock: Number(formData.stock) || 0,
        image: images,
        material: materials,
        dimensions: {
          height: formData.height,
          width: formData.width,
          depth: formData.depth,
          unit: formData.unit
        },
        description: formData.description,
        story: formData.story,
        model3D: {
          enabled: formData.model3DEnabled,
          glbUrl: formData.glbUrl,
          usdzUrl: formData.usdzUrl
        }
      };

      await api.put(`/products/${id}`, payload);
      navigate("/artisan/dashboard");
    } catch (err) {
      console.error("Error updating product:", err);
      setError(err.response?.data?.message || "Failed to update creation. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#17120f]">
        <Navbar />
        <div className="flex min-h-[60vh] flex-col items-center justify-center">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#d4af37]/20 border-t-[#d4af37]" />
          <p className="mt-4 font-serif text-[#8d8177]">Loading creation details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#17120f] text-[#f5efe8]">
      <Navbar />

      <main className="mx-auto max-w-[1000px] px-5 py-8 md:px-8 lg:py-12">
        {/* BACK LINK */}
        <Link
          to="/artisan/dashboard"
          className="group mb-8 inline-flex items-center gap-2 text-sm text-[#8d8177] transition hover:text-[#d4af37]"
        >
          <ArrowLeft size={16} className="transition group-hover:-translate-x-1" />
          Back to Artisan Dashboard
        </Link>

        {/* HEADER */}
        <div className="mb-8 border-b border-white/[0.08] pb-6">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d4af37]">
            Edit Mode
          </span>
          <h1 className="mt-1 font-serif text-3xl md:text-4xl text-[#f5efe8]">
            Update Creation Details
          </h1>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-xs text-red-300">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 1: ESSENTIAL INFO */}
          <div className="rounded-3xl border border-white/[0.08] bg-[#211b17] p-6 md:p-8 shadow-xl space-y-6">
            <h2 className="font-serif text-xl text-[#f5efe8] border-b border-white/[0.06] pb-3">
              1. Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium uppercase tracking-wider text-[#8d8177] mb-2">
                  Creation Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-sm text-[#f5efe8] outline-none focus:border-[#d4af37]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#8d8177] mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#1e1814] px-4 py-3.5 text-sm text-[#f5efe8] outline-none focus:border-[#d4af37]/50"
                >
                  <option value="Pottery">Pottery</option>
                  <option value="Textiles">Textiles & Weaving</option>
                  <option value="Woodwork">Woodwork & Carving</option>
                  <option value="Painting">Traditional Painting</option>
                  <option value="Jewelry">Handmade Jewelry</option>
                  <option value="Metalwork">Brass & Metal Craft</option>
                  <option value="Home Decor">Home Decor</option>
                  <option value="Sculptures">Sculptures</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#8d8177] mb-2">
                  Art Form / Tradition
                </label>
                <input
                  type="text"
                  name="artForm"
                  value={formData.artForm}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-sm text-[#f5efe8] outline-none focus:border-[#d4af37]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#8d8177] mb-2">
                  Price (₹ INR) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-sm text-[#f5efe8] outline-none focus:border-[#d4af37]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#8d8177] mb-2">
                  Available Stock (Units) *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-sm text-[#f5efe8] outline-none focus:border-[#d4af37]/50"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: IMAGES */}
          <div className="rounded-3xl border border-white/[0.08] bg-[#211b17] p-6 md:p-8 shadow-xl space-y-6">
            <h2 className="font-serif text-xl text-[#f5efe8] border-b border-white/[0.06] pb-3 flex items-center gap-2">
              <ImageIcon size={18} className="text-[#d4af37]" />
              2. Imagery
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#8d8177] mb-2">
                  Primary Image URL *
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-sm text-[#f5efe8] outline-none focus:border-[#d4af37]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-[#8d8177] mb-2">
                  Additional Images (Optional, comma-separated URLs)
                </label>
                <input
                  type="text"
                  name="additionalImages"
                  value={formData.additionalImages}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-sm text-[#f5efe8] outline-none focus:border-[#d4af37]/50"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: SPECIFICATIONS */}
          <div className="rounded-3xl border border-white/[0.08] bg-[#211b17] p-6 md:p-8 shadow-xl space-y-6">
            <h2 className="font-serif text-xl text-[#f5efe8] border-b border-white/[0.06] pb-3">
              3. Specifications & Materials
            </h2>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#8d8177] mb-2">
                Materials Used (comma-separated)
              </label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-sm text-[#f5efe8] outline-none focus:border-[#d4af37]/50"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#8d8177] mb-2">
                Dimensions
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <input
                  type="text"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  placeholder="Height"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-[#f5efe8] outline-none focus:border-[#d4af37]/50"
                />
                <input
                  type="text"
                  name="width"
                  value={formData.width}
                  onChange={handleChange}
                  placeholder="Width"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-[#f5efe8] outline-none focus:border-[#d4af37]/50"
                />
                <input
                  type="text"
                  name="depth"
                  value={formData.depth}
                  onChange={handleChange}
                  placeholder="Depth"
                  className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-[#f5efe8] outline-none focus:border-[#d4af37]/50"
                />
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/[0.08] bg-[#1e1814] px-4 py-3 text-sm text-[#f5efe8] outline-none focus:border-[#d4af37]/50"
                >
                  <option value="cm">cm</option>
                  <option value="inches">inches</option>
                  <option value="mm">mm</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#8d8177] mb-2">
                Product Description
              </label>
              <textarea
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-sm text-[#f5efe8] outline-none focus:border-[#d4af37]/50"
              />
            </div>
          </div>

          {/* SECTION 4: STORY */}
          <div className="rounded-3xl border border-[#d4af37]/20 bg-[#211b17] p-6 md:p-8 shadow-xl space-y-6">
            <h2 className="font-serif text-xl text-[#f5efe8] border-b border-white/[0.06] pb-3 flex items-center gap-2">
              <Sparkles size={18} className="text-[#d4af37]" />
              4. The Story Behind the Creation
            </h2>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-[#8d8177] mb-2">
                Creation Story
              </label>
              <textarea
                rows={5}
                name="story"
                value={formData.story}
                onChange={handleChange}
                className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-sm text-[#f5efe8] outline-none focus:border-[#d4af37]/50"
              />
            </div>
          </div>

          {/* SECTION 5: 3D MODEL */}
          <div className="rounded-3xl border border-white/[0.08] bg-[#211b17] p-6 md:p-8 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h2 className="font-serif text-xl text-[#f5efe8] flex items-center gap-2">
                <Box size={18} className="text-[#d4af37]" />
                5. 3D Digital Twin
              </h2>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#d4af37]">
                <input
                  type="checkbox"
                  name="model3DEnabled"
                  checked={formData.model3DEnabled}
                  onChange={handleChange}
                  className="rounded accent-[#d4af37]"
                />
                Enable 3D View
              </label>
            </div>

            {formData.model3DEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#8d8177] mb-2">
                    GLB Asset URL (.glb)
                  </label>
                  <input
                    type="url"
                    name="glbUrl"
                    value={formData.glbUrl}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-sm text-[#f5efe8] outline-none focus:border-[#d4af37]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-[#8d8177] mb-2">
                    USDZ Asset URL (.usdz)
                  </label>
                  <input
                    type="url"
                    name="usdzUrl"
                    value={formData.usdzUrl}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-sm text-[#f5efe8] outline-none focus:border-[#d4af37]/50"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SUBMIT BUTTONS */}
          <div className="flex justify-end gap-4">
            <Link
              to="/artisan/dashboard"
              className="rounded-xl border border-white/[0.08] px-6 py-4 text-sm font-semibold text-[#8d8177] transition hover:text-[#f5efe8]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#d4af37] px-8 py-4 text-sm font-semibold text-[#17120f] shadow-xl transition hover:bg-[#e7c85c]"
            >
              <Save size={17} />
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditProduct;
