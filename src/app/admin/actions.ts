"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createStory(formData: FormData) {
  const title = formData.get("title") as string;
  const genre = formData.get("genre") as string;
  const summary = formData.get("summary") as string;

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
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function createChapter(formData: FormData) {
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
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const genre = formData.get("genre") as string;
  const summary = formData.get("summary") as string;

  // We don't update the slug to avoid breaking existing links
  await prisma.story.update({
    where: { id },
    data: {
      title,
      genre,
      summary,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteStory(formData: FormData) {
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
