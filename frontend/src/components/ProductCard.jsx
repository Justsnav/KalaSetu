import { Sparkles, MapPin } from "lucide-react";

const ProductCard = ({ product, onClick }) => {
    const displayImage = Array.isArray(product.image)
        ? product.image[0]
        : product.image;

    const artisanName = product.artistId?.name || "";
    const artisanLocation = product.artistId?.location || "";

    return (
        <div
            onClick={onClick}
            className="group cursor-pointer overflow-hidden rounded-xl border border-[#e8dfd5] bg-[#fffaf4] transition duration-300 hover:-translate-y-1.5 hover:border-[#d4af37]/50 hover:shadow-xl flex flex-col justify-between"
        >
            {/* IMAGE */}
            <div>
                <div className="relative aspect-[4/3] overflow-hidden bg-[#eee5dc]">
                    {displayImage ? (
                        <img
                            src={displayImage}
                            alt={product.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-[#a59a90] text-sm">
                            Handmade Artifact
                        </div>
                    )}

                    {product.artForm && (
                        <span className="absolute top-3 left-3 rounded-full bg-[#17120f]/80 backdrop-blur-md px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-[#d4af37]">
                            {product.artForm}
                        </span>
                    )}

                    {product.model3D?.enabled && (
                        <span className="absolute top-3 right-3 rounded-full bg-[#d4af37] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#17120f]">
                            3D View
                        </span>
                    )}
                </div>

                {/* CONTENT */}
                <div className="p-5">
                    <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#b76532]">
                            {product.category}
                        </p>
                        {artisanLocation && (
                            <span className="flex items-center gap-1 text-[11px] text-[#8d8177]">
                                <MapPin size={11} className="text-[#b76532]" />
                                {artisanLocation}
                            </span>
                        )}
                    </div>

                    <h3 className="font-serif text-xl text-[#29231f] line-clamp-1 group-hover:text-[#b76532] transition-colors">
                        {product.title}
                    </h3>

                    {artisanName && (
                        <p className="mt-1 text-xs text-[#706761] line-clamp-1">
                            Crafted by <span className="font-medium text-[#29231f]">{artisanName}</span>
                        </p>
                    )}
                </div>
            </div>

            {/* FOOTER */}
            <div className="px-5 pb-5 pt-2 border-t border-[#eee5dc] flex items-center justify-between">
                <p className="text-lg font-semibold text-[#29231f]">
                    ₹{Number(product.price).toLocaleString("en-IN")}
                </p>

                <span className={`text-xs ${product.stock > 0 ? "text-[#706761]" : "text-red-500 font-medium"}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : "Sold Out"}
                </span>
            </div>
        </div>
    );
};

export default ProductCard;