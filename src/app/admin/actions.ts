"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    throw new Error("Unauthorized: Chỉ Quản Trị Viên mới có quyền thực hiện hành động này.");
  }
  return session.user;
}

export async function createStory(formData: FormData) {
  await requireAdmin();
  const title = formData.get("title") as string;
  const genre = formData.get("genre") as string;
  const summary = formData.get("summary") as string;
  const coverUrl = (formData.get("coverUrl") as string) || null;

  // Simple slugify for Vietnamese
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  await prisma.story.create({
    data: {
      title,
      slug,
      genre,
      summary,
      coverUrl,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function createChapter(formData: FormData) {
  await requireAdmin();
  const storyId = formData.get("storyId") as string;
  const storySlug = formData.get("storySlug") as string;
  const chapterNo = parseInt(formData.get("chapterNo") as string, 10);
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  await prisma.chapter.create({
    data: {
      storyId,
      chapterNo,
      title,
      content,
    },
  });

  // Update story updatedAt timestamp
  await prisma.story.update({
    where: { id: storyId },
    data: { updatedAt: new Date() }
  });

  revalidatePath("/");
  revalidatePath(`/truyen/${storySlug}`);
  revalidatePath(`/admin/story/${storySlug}`);
  redirect(`/admin/story/${storySlug}`);
}

export async function updateStory(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const genre = formData.get("genre") as string;
  const summary = formData.get("summary") as string;
  const coverUrl = (formData.get("coverUrl") as string) || null;

  // We don't update the slug to avoid breaking existing links
  await prisma.story.update({
    where: { id },
    data: {
      title,
      genre,
      summary,
      coverUrl,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteStory(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;

  // Cascade delete is usually handled by Prisma if configured, 
  // but let's be explicit just in case: delete chapters first.
  await prisma.chapter.deleteMany({
    where: { storyId: id }
  });

  await prisma.story.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updateChapter(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  const storySlug = formData.get("storySlug") as string;
  const chapterNo = parseInt(formData.get("chapterNo") as string, 10);
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  await prisma.chapter.update({
    where: { id },
    data: {
      chapterNo,
      title,
      content,
    },
  });

  revalidatePath("/");
  revalidatePath(`/truyen/${storySlug}`);
  revalidatePath(`/admin/story/${storySlug}`);
  redirect(`/admin/story/${storySlug}`);
}

export async function deleteChapter(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  const storySlug = formData.get("storySlug") as string;

  await prisma.chapter.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath(`/truyen/${storySlug}`);
  revalidatePath(`/admin/story/${storySlug}`);
  redirect(`/admin/story/${storySlug}`);
}

// -------------------------------------------------------------
// CHARACTER MANAGEMENT ACTIONS
// -------------------------------------------------------------

export async function createCharacter(formData: FormData) {
  await requireAdmin();
  const storyId = formData.get("storyId") as string;
  const storySlug = formData.get("storySlug") as string;
  const name = formData.get("name") as string;
  const aliases = (formData.get("aliases") as string) || null;
  const role = (formData.get("role") as string) || null;
  const avatarUrl = (formData.get("avatarUrl") as string) || null;
  const description = (formData.get("description") as string) || null;

  await prisma.character.create({
    data: {
      storyId,
      name: name.trim(),
      aliases: aliases ? aliases.trim() : null,
      role: role ? role.trim() : null,
      avatarUrl,
      description: description ? description.trim() : null,
    },
  });

  revalidatePath(`/truyen/${storySlug}`);
  revalidatePath(`/admin/story/${storySlug}/characters`);
  redirect(`/admin/story/${storySlug}/characters`);
}

export async function deleteCharacter(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  const storySlug = formData.get("storySlug") as string;

  await prisma.character.delete({
    where: { id },
  });

  revalidatePath(`/truyen/${storySlug}`);
  revalidatePath(`/admin/story/${storySlug}/characters`);
  redirect(`/admin/story/${storySlug}/characters`);
}
