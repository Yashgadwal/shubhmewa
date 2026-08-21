"use server";

import { getAdminSession } from "./actions";
import { revalidatePath } from "next/cache";

export async function adminSaveProduct(data: {
  id?: string;
  name: string;
  sku: string;
  description: string;
  categoryId: string;
  originalPrice: number;
  discountedPrice?: number | null;
  imageUrl?: string;
  isBestseller: boolean;
  isNewArrival: boolean;
  isActive: boolean;
}) {
  const session = await getAdminSession();
  if (!session) return { error: "Unauthorized." };

  try {
    const slug = data.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const product = {
      id: data.id || `prod-${Math.floor(1000 + Math.random() * 9000)}`,
      name: data.name,
      slug,
      sku: data.sku,
      description: data.description,
      categoryId: data.categoryId,
      originalPrice: data.originalPrice,
      discountedPrice: data.discountedPrice || null,
      isBestseller: data.isBestseller,
      isNewArrival: data.isNewArrival,
      isActive: data.isActive,
      images: data.imageUrl ? [{ url: data.imageUrl }] : [],
      variants: []
    };

    console.log("Database-Free Admin Saved Product:", product);

    revalidatePath("/admin/products");
    return { success: true, product };
  } catch (error: any) {
    console.error("Save product error:", error);
    return { error: error.message || "Failed to save product." };
  }
}
