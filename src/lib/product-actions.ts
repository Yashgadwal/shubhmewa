"use server";

import { prisma } from "./prisma";
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
    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) {
      return { error: "Selected category does not exist." };
    }

    let product;

    if (data.id) {
      // 1. UPDATE existing product
      product = await prisma.product.update({
        where: { id: data.id },
        data: {
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
        },
      });

      // Update primary image if provided
      if (data.imageUrl) {
        // Delete old images
        await prisma.productImage.deleteMany({ where: { productId: data.id } });
        // Add new image
        await prisma.productImage.create({
          data: {
            productId: data.id,
            url: data.imageUrl,
            isPrimary: true,
          },
        });
      }

      await prisma.activityLog.create({
        data: {
          adminId: session.id,
          action: "UPDATE_PRODUCT",
          details: `Updated product ${product.name} (SKU: ${product.sku})`,
        },
      });

    } else {
      // 2. CHECK if SKU already exists
      const dupSku = await prisma.product.findUnique({
        where: { sku: data.sku },
      });
      if (dupSku) {
        return { error: `A product with SKU "${data.sku}" already exists.` };
      }

      // 3. CREATE new product
      product = await prisma.product.create({
        data: {
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
        },
      });

      // Add primary image if provided
      if (data.imageUrl) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: data.imageUrl,
            isPrimary: true,
          },
        });
      }

      await prisma.activityLog.create({
        data: {
          adminId: session.id,
          action: "CREATE_PRODUCT",
          details: `Created product ${product.name} (SKU: ${product.sku})`,
        },
      });
    }

    revalidatePath("/admin/products");
    return { success: true, product };
  } catch (error: any) {
    console.error("Save product error:", error);
    return { error: error.message || "Failed to save product in database." };
  }
}
