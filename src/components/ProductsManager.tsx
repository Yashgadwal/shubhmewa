"use client";

import React, { useState } from "react";
import { Search, Plus, Trash2, Check, X, Edit, Sparkles, Filter } from "lucide-react";
import { deleteProduct, toggleProductField } from "@/lib/actions";
import { adminSaveProduct } from "@/lib/product-actions";

interface ProductImage {
  url: string;
}

interface ProductVariant {
  id: string;
  weight: string;
  originalPrice: number;
  discountedPrice?: number | null;
  sku?: string | null;
  stockQuantity: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  originalPrice: number;
  discountedPrice: number | null;
  sku: string;
  stockQuantity: number;
  isBestseller: boolean;
  isNewArrival: boolean;
  isActive: boolean;
  category: { name: string };
  images: ProductImage[];
  variants: ProductVariant[];
}

interface Category {
  id: string;
  name: string;
}

interface ProductsManagerProps {
  initialProducts: Product[];
  categories: Category[];
}

export default function ProductsManager({ initialProducts, categories }: ProductsManagerProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [updating, setUpdating] = useState<string | null>(null);

  // Modal form states
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [originalPrice, setOriginalPrice] = useState(100);
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isBestseller, setIsBestseller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const [saveLoading, setSaveLoading] = useState(false);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === "ALL" || p.categoryId === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle Toggle Field
  const handleToggle = async (productId: string, field: "isActive" | "isBestseller" | "isNewArrival", currentValue: boolean) => {
    setUpdating(productId);
    const newValue = !currentValue;
    const res = await toggleProductField(productId, field, newValue);
    setUpdating(null);

    if (res.success) {
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, [field]: newValue } : p))
      );
    }
  };

  // Handle Delete Product
  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product? This will remove all its variants.")) return;
    
    setUpdating(productId);
    const res = await deleteProduct(productId);
    setUpdating(null);

    if (res.success) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } else {
      alert(res.error || "Failed to delete product.");
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setName("");
    setSku("");
    setDescription("");
    setCategoryId(categories[0]?.id || "");
    setOriginalPrice(100);
    setDiscountedPrice(null);
    setImageUrl("");
    setIsBestseller(false);
    setIsNewArrival(false);
    setIsActive(true);
    setShowModal(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSku(p.sku);
    setDescription(p.description);
    setCategoryId(p.categoryId);
    setOriginalPrice(p.originalPrice);
    setDiscountedPrice(p.discountedPrice);
    setImageUrl(p.images[0]?.url || "");
    setIsBestseller(p.isBestseller);
    setIsNewArrival(p.isNewArrival);
    setIsActive(p.isActive);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);

    const payload = {
      id: editingProduct?.id,
      name,
      sku,
      description,
      categoryId,
      originalPrice,
      discountedPrice: discountedPrice || null,
      imageUrl,
      isBestseller,
      isNewArrival,
      isActive,
    };

    const res = await adminSaveProduct(payload);
    setSaveLoading(false);

    if (res.error) {
      alert(res.error);
    } else {
      alert("Product details saved successfully!");
      setShowModal(false);
      
      // Update local listing state dynamically
      if (payload.id) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === payload.id
              ? {
                  ...p,
                  name: res.product!.name,
                  sku: res.product!.sku,
                  description: res.product!.description,
                  categoryId: res.product!.categoryId,
                  originalPrice: res.product!.originalPrice,
                  discountedPrice: res.product!.discountedPrice,
                  isBestseller: res.product!.isBestseller,
                  isNewArrival: res.product!.isNewArrival,
                  isActive: res.product!.isActive,
                  category: { name: categories.find((c) => c.id === categoryId)?.name || "" },
                  images: imageUrl ? [{ url: imageUrl }] : p.images,
                }
              : p
          )
        );
      } else {
        const newProduct = {
          ...res.product,
          category: { name: categories.find((c) => c.id === categoryId)?.name || "" },
          images: imageUrl ? [{ url: imageUrl }] : [],
          variants: [],
        } as unknown as Product;
        setProducts((prev) => [newProduct, ...prev]);
      }
    }
  };

  return (
    <div className="space-y-6 font-sans text-brand-green">
      
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white border border-brand-cream-dark/30 p-4 rounded-xl shadow-xs">
        
        {/* Left Side: Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-60">
            <input
              type="text"
              placeholder="Search products, SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-brand-cream-light/10 border border-brand-cream-dark/50 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-brand-gold pl-9"
            />
            <Search className="w-4 h-4 text-brand-muted absolute left-3 top-2.5" />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-brand-cream-light/10 border border-brand-cream-dark/50 px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green font-semibold"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Right Side: Add Button */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <p className="text-xs text-brand-muted font-medium">
            Catalog Count: <span className="font-bold text-brand-green">{products.length}</span>
          </p>
          
          <button
            onClick={openCreateModal}
            className="bg-brand-green hover:bg-brand-green/95 text-brand-cream-light px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-brand-gold" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-brand-cream-dark/30 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-brand-cream-light/40 text-brand-green font-bold uppercase tracking-wider border-b border-brand-cream-dark/20">
                <th className="p-4">SKU / Code</th>
                <th className="p-4">Product Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price (Base)</th>
                <th className="p-4 text-center">Bestseller</th>
                <th className="p-4 text-center">New Arrival</th>
                <th className="p-4 text-center">Active</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-brand-muted">
                    No products found in database matching selection.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isUpdating = updating === p.id;
                  return (
                    <tr
                      key={p.id}
                      className={`border-b border-brand-cream-light/35 hover:bg-brand-cream-light/10 ${
                        isUpdating ? "opacity-50" : ""
                      }`}
                    >
                      <td className="p-4 font-bold text-brand-green">{p.sku}</td>
                      <td className="p-4 text-brand-green font-semibold">
                        <div className="flex items-center gap-2">
                          <img
                            src={p.images[0]?.url || "/images/product_almond.jpg"}
                            alt={p.name}
                            className="w-8 h-8 object-cover rounded-md border border-brand-cream-dark/20 shrink-0"
                          />
                          <span className="line-clamp-1">{p.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-brand-muted uppercase font-bold text-[10px] tracking-wider">
                        {p.category.name}
                      </td>
                      <td className="p-4 text-brand-green font-bold">
                        {p.discountedPrice ? (
                          <div className="flex items-baseline gap-1">
                            <span>₹{p.discountedPrice}</span>
                            <span className="text-[10px] text-brand-muted line-through">₹{p.originalPrice}</span>
                          </div>
                        ) : (
                          `₹${p.originalPrice}`
                        )}
                      </td>
                      
                      {/* Bestseller Toggle */}
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggle(p.id, "isBestseller", p.isBestseller)}
                          disabled={isUpdating}
                          className={`w-6 h-6 rounded-md border flex items-center justify-center mx-auto transition-all cursor-pointer ${
                            p.isBestseller
                              ? "bg-brand-gold border-brand-gold text-white"
                              : "border-brand-cream-dark text-brand-cream-dark hover:border-brand-gold"
                          }`}
                        >
                          {p.isBestseller && <Check className="w-3.5 h-3.5" />}
                        </button>
                      </td>

                      {/* New Arrival Toggle */}
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggle(p.id, "isNewArrival", p.isNewArrival)}
                          disabled={isUpdating}
                          className={`w-6 h-6 rounded-md border flex items-center justify-center mx-auto transition-all cursor-pointer ${
                            p.isNewArrival
                              ? "bg-brand-green border-brand-green text-white"
                              : "border-brand-cream-dark text-brand-cream-dark hover:border-brand-green"
                          }`}
                        >
                          {p.isNewArrival && <Check className="w-3.5 h-3.5" />}
                        </button>
                      </td>

                      {/* Active Toggle */}
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggle(p.id, "isActive", p.isActive)}
                          disabled={isUpdating}
                          className={`w-6 h-6 rounded-md border flex items-center justify-center mx-auto transition-all cursor-pointer ${
                            p.isActive
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "border-brand-cream-dark text-brand-cream-dark hover:border-emerald-600"
                          }`}
                        >
                          {p.isActive && <Check className="w-3.5 h-3.5" />}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="inline-flex gap-2 justify-end">
                          <button
                            onClick={() => openEditModal(p)}
                            disabled={isUpdating}
                            className="p-1.5 text-brand-gold hover:bg-brand-cream-light/10 rounded-lg border border-brand-cream-dark/25 transition-all font-bold text-[10px] uppercase flex items-center gap-0.5 cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          
                          <button
                            onClick={() => handleDelete(p.id)}
                            disabled={isUpdating}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center gap-1 font-semibold cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-brand-cream-dark/30 rounded-3xl p-6 max-w-md w-full shadow-lg space-y-5 text-left relative max-h-[90vh] overflow-y-auto animate-fadeIn">
            
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 p-1 hover:bg-brand-cream-light/20 text-brand-muted hover:text-brand-green rounded-full transition-all"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div>
              <span className="text-[9px] uppercase font-bold tracking-widest text-brand-gold">Inventory CRUD Control</span>
              <h3 className="font-serif-editorial text-lg text-brand-green font-bold mt-1">
                {editingProduct ? "Edit Product Details" : "Add New Catalog Product"}
              </h3>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold text-brand-green">
              {/* Product Name */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider block">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Premium Almonds (Badam)"
                  className="w-full bg-brand-cream-light/10 border border-brand-cream-dark/50 px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-brand-gold text-brand-green"
                />
              </div>

              {/* SKU & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider block">
                    SKU Code (Unique)
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!editingProduct}
                    value={sku}
                    onChange={(e) => setSku(e.target.value.trim().toUpperCase())}
                    placeholder="e.g. KAJU-250G"
                    className="w-full bg-brand-cream-light/10 border border-brand-cream-dark/50 px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-brand-gold text-brand-green font-bold disabled:opacity-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider block">
                    Product Category
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-brand-cream-light/10 border border-brand-cream-dark/50 px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-brand-gold text-brand-green font-semibold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider block">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-brand-cream-light/10 border border-brand-cream-dark/50 px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-brand-gold text-brand-green font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold uppercase tracking-wider block">
                    Discounted Price (₹, Opt)
                  </label>
                  <input
                    type="number"
                    value={discountedPrice || ""}
                    onChange={(e) => setDiscountedPrice(parseFloat(e.target.value) || null)}
                    placeholder="Offer Price"
                    className="w-full bg-brand-cream-light/10 border border-brand-cream-dark/50 px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-brand-gold text-brand-green font-bold"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider block">
                  Product Image URL
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="e.g. /images/product_almond.jpg"
                  className="w-full bg-brand-cream-light/10 border border-brand-cream-dark/50 px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-brand-gold text-brand-green"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider block">
                  Description
                </label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain benefits, sourcing origin, and weights details..."
                  className="w-full bg-brand-cream-light/10 border border-brand-cream-dark/50 px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-brand-gold text-brand-green h-16 font-normal"
                />
              </div>

              {/* Badges and options */}
              <div className="grid grid-cols-3 gap-2 py-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isBestseller}
                    onChange={(e) => setIsBestseller(e.target.checked)}
                    className="accent-brand-green w-3.5 h-3.5 border-brand-cream-dark rounded"
                  />
                  <span className="text-[10px] text-brand-green select-none">Bestseller</span>
                </label>
                
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                    className="accent-brand-green w-3.5 h-3.5 border-brand-cream-dark rounded"
                  />
                  <span className="text-[10px] text-brand-green select-none">New Arrival</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="accent-brand-green w-3.5 h-3.5 border-brand-cream-dark rounded"
                  />
                  <span className="text-[10px] text-brand-green select-none">Available</span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={saveLoading}
                className="w-full bg-brand-green text-brand-cream-light py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs cursor-pointer text-center block"
              >
                {saveLoading ? "Saving Product..." : "Save Product Details"}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
