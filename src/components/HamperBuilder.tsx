"use client";

import React, { useState } from "react";
import { Sparkles, Check, ShoppingBag, Gift } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface HamperBuilderProps {
  whatsappNumber: string;
}

export default function HamperBuilder({ whatsappNumber }: HamperBuilderProps) {
  const { addItem, setIsOpen } = useCart();
  const packagingOptions = [
    { id: "wood", name: "Designer Wooden Box", price: 350, image: "/images/hamper_wedding.jpg" },
    { id: "velvet", name: "Premium Velvet Tray", price: 400, image: "/images/gift_packaging.jpg" },
    { id: "jars", name: "Glass Jar Set (in Ivory box)", price: 250, image: "/images/shop_jars.jpg" },
    { id: "cardboard", name: "Luxury Gold Cardboard Box", price: 150, image: "/images/hamper_corporate.jpg" },
  ];

  const ingredientOptions = [
    { id: "almonds", name: "Jumbo California Almonds", pricePer100g: 100 },
    { id: "cashews", name: "Royal W180 Cashews", pricePer100g: 130 },
    { id: "pistachios", name: "Iranian Salted Pistachios", pricePer100g: 110 },
    { id: "walnuts", name: "Kashmiri Walnuts", pricePer100g: 140 },
    { id: "raisins", name: "Afghan Golden Raisins", pricePer100g: 60 },
    { id: "dates", name: "Jordan Medjool Dates", pricePer100g: 180 },
  ];

  const [selectedPack, setSelectedPack] = useState(packagingOptions[0].id);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([
    "almonds",
    "cashews",
  ]);
  const [quantity, setQuantity] = useState(10);
  const [message, setMessage] = useState("");
  const [targetBudget, setTargetBudget] = useState("1000");

  const handleToggleIngredient = (id: string) => {
    setSelectedIngredients((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        if (prev.length >= 6) return prev; // Enforce maximum of 6 items
        return [...prev, id];
      }
    });
  };

  const selectedPackDetails = packagingOptions.find((p) => p.id === selectedPack)!;
  const ingredientsCount = selectedIngredients.length;
  
  // Calculate estimate: packaging price + (average ingredient price * 200g each)
  const estimatedHamperCost =
    selectedPackDetails.price +
    selectedIngredients.reduce((sum, ingId) => {
      const ing = ingredientOptions.find((i) => i.id === ingId);
      return sum + (ing ? ing.pricePer100g * 2 : 0); // 200g of each selected item
    }, 0);

  const handleAddHamperToCart = (e: React.FormEvent) => {
    e.preventDefault();

    if (ingredientsCount < 2) return;

    const selectedIngNames = selectedIngredients
      .map((id) => ingredientOptions.find((i) => i.id === id)?.name)
      .filter(Boolean)
      .join(", ");

    addItem({
      id: `custom-hamper-${Date.now()}`,
      variantId: undefined,
      name: `Custom Hamper (${selectedPackDetails.name})`,
      weight: `${ingredientsCount} Ingredients: ${selectedIngNames}`,
      price: estimatedHamperCost,
      image: selectedPackDetails.image,
    }, quantity);
    setIsOpen(true);
  };

  return (
    <div className="w-full bg-brand-cream-light border border-brand-cream-dark/50 p-6 md:p-10 rounded-3xl font-sans grid grid-cols-1 lg:grid-cols-12 gap-8 shadow-xs">
      
      {/* Configuration Column */}
      <div className="lg:col-span-8 space-y-6">
        <div>
          <h3 className="font-serif-editorial text-2xl text-brand-green font-bold flex items-center gap-2">
            <Gift className="w-5 h-5 text-brand-gold" />
            Curate Your Own Gift Box
          </h3>
          <p className="text-xs text-brand-muted mt-1 leading-relaxed">
            Select packaging and dry fruit combinations. We pack everything fresh with custom greeting cards.
          </p>
        </div>

        {/* Step 1: Packaging */}
        <div className="space-y-3">
          <span className="text-[10px] tracking-wider uppercase font-bold text-brand-green block">
            Step 1: Choose Gifting Outer Box
          </span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {packagingOptions.map((pack) => {
              const isSelected = selectedPack === pack.id;
              return (
                <button
                  key={pack.id}
                  type="button"
                  onClick={() => setSelectedPack(pack.id)}
                  className={`flex flex-col text-left border rounded-xl overflow-hidden bg-white transition-all ${
                    isSelected ? "border-brand-gold ring-1 ring-brand-gold" : "border-brand-cream-dark/30 hover:border-brand-gold"
                  }`}
                >
                  <img
                    src={pack.image}
                    alt={pack.name}
                    className="w-full aspect-[4/3] object-cover"
                  />
                  <div className="p-3">
                    <p className="text-[11px] font-bold text-brand-green leading-snug line-clamp-2">
                      {pack.name}
                    </p>
                    <span className="text-[10px] text-brand-gold font-bold mt-1 block">
                      + ₹{pack.price}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Ingredients */}
        <div className="space-y-3">
          <span className="text-[10px] tracking-wider uppercase font-bold text-brand-green block">
            Step 2: Choose Assortment Mix (200g standard fill per item)
          </span>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ingredientOptions.map((ing) => {
              const isSelected = selectedIngredients.includes(ing.id);
              return (
                <button
                  key={ing.id}
                  type="button"
                  onClick={() => handleToggleIngredient(ing.id)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border text-left bg-white transition-all ${
                    isSelected
                      ? "border-brand-gold bg-brand-cream-light/30"
                      : "border-brand-cream-dark/30 hover:border-brand-gold"
                  }`}
                >
                  <div>
                    <p className="text-[11px] font-bold text-brand-green">{ing.name}</p>
                    <span className="text-[9px] text-brand-muted block mt-0.5">
                      approx. ₹{ing.pricePer100g * 2} / 200g
                    </span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? "bg-brand-gold border-brand-gold text-white"
                        : "border-brand-cream-dark"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Card and Qty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] tracking-wider uppercase font-bold text-brand-green block mb-1">
              Custom Card Message
            </label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Wishing you a happy Diwali! From Sharma family"
              className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green bg-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] tracking-wider uppercase font-bold text-brand-green block mb-1">
                Quantity *
              </label>
              <input
                type="number"
                min={1}
                required
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green bg-white"
              />
            </div>
            <div>
              <label className="text-[10px] tracking-wider uppercase font-bold text-brand-green block mb-1">
                Target Budget *
              </label>
              <select
                value={targetBudget}
                onChange={(e) => setTargetBudget(e.target.value)}
                className="w-full border border-brand-cream-dark/50 px-3.5 py-2.5 rounded-xl text-xs focus:outline-none focus:border-brand-gold text-brand-green bg-white"
              >
                <option value="500">Under ₹500</option>
                <option value="1000">₹500 - ₹1000</option>
                <option value="1500">₹1000 - ₹1500</option>
                <option value="2500">₹1500 - ₹2500</option>
                <option value="5000">₹2500 - ₹5000</option>
                <option value="10000">₹5000+ Luxury</option>
              </select>
            </div>
          </div>
        </div>

      </div>

      {/* Estimate/Submit Column */}
      <div className="lg:col-span-4 bg-white border border-brand-cream-dark/30 p-6 rounded-2xl flex flex-col justify-between shadow-xs">
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 text-brand-gold">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] tracking-widest font-bold uppercase">Live Estimation</span>
          </div>

          <div className="border-b border-brand-cream-dark/20 pb-4">
            <span className="text-[10px] text-brand-muted font-bold block uppercase tracking-wider">
              Selected Packaging
            </span>
            <p className="text-sm font-semibold text-brand-green mt-1">{selectedPackDetails.name}</p>
          </div>

          <div className="border-b border-brand-cream-dark/20 pb-4">
            <span className="text-[10px] text-brand-muted font-bold block uppercase tracking-wider">
              Dry Fruit Mix ({ingredientsCount} items)
            </span>
            {ingredientsCount < 2 ? (
              <p className="text-xs text-red-500 mt-1">Please select at least 2 ingredients (Min: 2, Max: 6).</p>
            ) : (
              <ul className="text-xs text-brand-green space-y-1.5 mt-2">
                {selectedIngredients.map((id) => {
                  const ing = ingredientOptions.find((i) => i.id === id);
                  return ing ? (
                    <li key={id} className="flex justify-between">
                      <span>{ing.name} (200g)</span>
                      <span className="font-semibold">₹{ing.pricePer100g * 2}</span>
                    </li>
                  ) : null;
                })}
              </ul>
            )}
          </div>

          <div className="pt-2">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-brand-muted uppercase font-bold">Est. Cost / Unit</span>
              <span className="text-2xl font-bold text-brand-green">₹{estimatedHamperCost}</span>
            </div>
            <div className="flex justify-between items-baseline mt-1 border-t border-brand-cream-dark/15 pt-2">
              <span className="text-xs text-brand-muted uppercase font-bold">Total Est ({quantity} units)</span>
              <span className="text-lg font-bold text-brand-gold">₹{estimatedHamperCost * quantity}</span>
            </div>
            <p className="text-[10px] text-brand-muted mt-2 leading-relaxed">
              *Estimate is based on 200g filling per nut option. Final pricing varies by box sizes and dry fruit grade configurations.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddHamperToCart}
          disabled={ingredientsCount < 2 || ingredientsCount > 6}
          className="w-full bg-brand-green hover:bg-brand-green/95 disabled:opacity-50 text-brand-cream-light py-3.5 rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md mt-6 cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4 text-brand-gold" />
          <span>Add Hamper to Cart</span>
        </button>
      </div>

    </div>
  );
}
