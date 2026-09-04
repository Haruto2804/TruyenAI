"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

async function requireAdmin() {
  const session = await auth();
  const isDev = process.env.NODE_ENV === "development";
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  if (!isAdmin && !isDev) {
    throw new Error("Unauthorized: Chỉ Quản Trị Viên mới có quyền thực hiện hành động này.");
  }
  return session?.user || { id: "dev-admin", name: "Dev Admin", role: "ADMIN" };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function getGenres() {
  return prisma.genre.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createGenre(formData: FormData) {
  await requireAdmin();

  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;

  if (!name || name.length < 2) {
    return { success: false, error: "Tên thể loại phải có ít nhất 2 ký tự." };
  }

  const slug = slugify(name);

  // Check if exists
  const existing = await prisma.genre.findFirst({
    where: {
      OR: [{ name: { equals: name, mode: "insensitive" } }, { slug: slug }],
    },
  });

  if (existing) {
    return { success: false, error: `Thể loại "${name}" đã tồn tại.` };
  }

  await prisma.genre.create({
    data: {
      name,
      slug,
      description,
    },
  });

  revalidatePath("/admin/genres");
  revalidatePath("/admin/story/new");
  revalidatePath("/");

  return { success: true };
}

export async function updateGenre(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id") as string;
  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;

  if (!id || !name || name.length < 2) {
    return { success: false, error: "Dữ liệu thể loại không hợp lệ." };
  }

  const slug = slugify(name);

  // Check unique conflict with other genres
  const conflict = await prisma.genre.findFirst({
    where: {
      id: { not: id },
      OR: [{ name: { equals: name, mode: "insensitive" } }, { slug: slug }],
    },
  });

  if (conflict) {
    return { success: false, error: `Tên thể loại "${name}" trùng với thể loại khác.` };
  }

  await prisma.genre.update({
    where: { id },
    data: {
      name,
      slug,
      description,
    },
  });

  revalidatePath("/admin/genres");
  revalidatePath("/admin/story/new");
  revalidatePath("/");

  return { success: true };
}

export async function deleteGenre(id: string) {
  await requireAdmin();

  if (!id) {
    return { success: false, error: "ID không hợp lệ." };
  }

  await prisma.genre.delete({
    where: { id },
  });

  revalidatePath("/admin/genres");
  revalidatePath("/admin/story/new");
  revalidatePath("/");

  return { success: true };
}
