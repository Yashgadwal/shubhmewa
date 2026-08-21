"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { validateCouponCode } from "@/lib/actions";

export interface CartItem {
  id: string; // product id
  variantId?: string; // variant id (optional)
  name: string;
  weight: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string, variantId?: string) => void;
  updateQuantity: (id: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  subtotal: number;
  couponCode: string;
  couponError: string;
  discount: number;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [discount, setDiscount] = useState(0);

  // Load cart from LocalStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("hdf_cart");
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cart items", e);
      }
    }
  }, []);

  // Save cart to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem("hdf_cart", JSON.stringify(items));
  }, [items]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Re-validate coupon if subtotal changes
  useEffect(() => {
    if (couponCode && subtotal > 0) {
      validateCouponCode(couponCode, subtotal).then((res) => {
        if (res.valid) {
          setDiscount(res.discount || 0);
          setCouponError("");
        } else {
          setDiscount(0);
          setCouponError(res.error || "Coupon no longer valid");
        }
      });
    } else if (subtotal === 0) {
      setDiscount(0);
      setCouponCode("");
    }
  }, [subtotal, couponCode]);

  const addItem = (newItem: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === newItem.id && item.variantId === newItem.variantId
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        return [...prevItems, { ...newItem, quantity }];
      }
    });
    setIsOpen(true); // Open drawer on addition
  };

  const removeItem = (id: string, variantId?: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => !(item.id === id && item.variantId === variantId))
    );
  };

  const updateQuantity = (id: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeItem(id, variantId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.variantId === variantId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode("");
    setDiscount(0);
    setCouponError("");
  };

  const applyCoupon = async (code: string) => {
    const res = await validateCouponCode(code, subtotal);
    if (res.valid) {
      setCouponCode(code);
      setDiscount(res.discount || 0);
      setCouponError("");
      return true;
    } else {
      setCouponError(res.error || "Invalid coupon");
      setDiscount(0);
      return false;
    }
  };

  const removeCoupon = () => {
    setCouponCode("");
    setDiscount(0);
    setCouponError("");
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        setIsOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        couponCode,
        couponError,
        discount,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
