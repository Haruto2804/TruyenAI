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

function revalidateAllCharacterPaths(storySlug: string) {
  // Revalidate public story detail and all chapter readers
  revalidatePath(`/truyen/${storySlug}`, "layout");
  revalidatePath(`/truyen/${storySlug}`);
  revalidatePath(`/truyen/${storySlug}/[chapter]`, "page");
  
  // Revalidate admin management pages
  revalidatePath(`/admin/story/${storySlug}`, "layout");
  revalidatePath(`/admin/story/${storySlug}`);
  revalidatePath(`/admin/story/${storySlug}/characters`);
  revalidatePath(`/admin/story/${storySlug}/characters/[id]/edit`, "page");
  
  // Revalidate global entrypoints
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/admin", "layout");
  revalidatePath("/admin");
}

export async function createCharacter(formData: FormData) {
  await requireAdmin();
  const storyId = formData.get("storyId") as string;
  const storySlug = formData.get("storySlug") as string;
  const name = formData.get("name") as string;
  const aliases = (formData.get("aliases") as string) || null;
  const role = (formData.get("role") as string) || null;
  const avatarUrl = (formData.get("avatarUrl") as string) || null;
  const description = (formData.get("description") as string) || null;

  const char = await prisma.character.create({
    data: {
      storyId,
      name: name.trim(),
      aliases: aliases ? aliases.trim() : null,
      role: role ? role.trim() : null,
      avatarUrl,
      description: description ? description.trim() : null,
    },
    include: {
      story: { select: { slug: true } }
    }
  });

  await prisma.story.update({
    where: { id: storyId },
    data: { updatedAt: new Date() }
  });

  const slug = char.story?.slug || storySlug;
  revalidateAllCharacterPaths(slug);
  redirect(`/admin/story/${slug}/characters`);
}

export async function updateCharacter(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  const storySlug = formData.get("storySlug") as string;
  const name = formData.get("name") as string;
  const aliases = (formData.get("aliases") as string) || null;
  const role = (formData.get("role") as string) || null;
  const avatarUrl = (formData.get("avatarUrl") as string) || null;
  const description = (formData.get("description") as string) || null;

  const char = await prisma.character.update({
    where: { id },
    data: {
      name: name.trim(),
      aliases: aliases ? aliases.trim() : null,
      role: role ? role.trim() : null,
      avatarUrl,
      description: description ? description.trim() : null,
    },
    include: {
      story: { select: { slug: true } }
    }
  });

  await prisma.story.update({
    where: { id: char.storyId },
    data: { updatedAt: new Date() }
  });

  const slug = char.story?.slug || storySlug;
  revalidateAllCharacterPaths(slug);
  redirect(`/admin/story/${slug}/characters`);
}

export async function deleteCharacter(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  const storySlug = formData.get("storySlug") as string;

  const char = await prisma.character.findUnique({
    where: { id },
    include: {
      story: { select: { id: true, slug: true } }
    }
  });

  if (char) {
    await prisma.character.delete({
      where: { id },
    });

    await prisma.story.update({
      where: { id: char.storyId },
      data: { updatedAt: new Date() }
    });

    const slug = char.story?.slug || storySlug;
    revalidateAllCharacterPaths(slug);
    redirect(`/admin/story/${slug}/characters`);
  } else {
    revalidateAllCharacterPaths(storySlug);
    redirect(`/admin/story/${storySlug}/characters`);
  }
}

// -------------------------------------------------------------
// LORE / GLOSSARY MANAGEMENT ACTIONS
// -------------------------------------------------------------

function revalidateAllLorePaths(storySlug: string) {
  // Revalidate public story detail and all chapter readers
  revalidatePath(`/truyen/${storySlug}`, "layout");
  revalidatePath(`/truyen/${storySlug}`);
  revalidatePath(`/truyen/${storySlug}/[chapter]`, "page");
  
  // Revalidate admin management pages
  revalidatePath(`/admin/story/${storySlug}`, "layout");
  revalidatePath(`/admin/story/${storySlug}`);
  revalidatePath(`/admin/story/${storySlug}/lore`);
  revalidatePath(`/admin/story/${storySlug}/lore/[id]/edit`, "page");
  
  // Revalidate global entrypoints
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/admin", "layout");
  revalidatePath("/admin");
}

export async function createLore(formData: FormData) {
  await requireAdmin();
  const storyId = formData.get("storyId") as string;
  const storySlug = formData.get("storySlug") as string;
  const term = formData.get("term") as string;
  const category = (formData.get("category") as string) || null;
  const definition = formData.get("definition") as string;
  const aliases = (formData.get("aliases") as string) || null;

  const lore = await prisma.lore.create({
    data: {
      storyId,
      term: term.trim(),
      category: category ? category.trim() : null,
      definition: definition.trim(),
      aliases: aliases ? aliases.trim() : null,
    },
    include: {
      story: { select: { slug: true } }
    }
  });

  await prisma.story.update({
    where: { id: storyId },
    data: { updatedAt: new Date() }
  });

  const slug = lore.story?.slug || storySlug;
  revalidateAllLorePaths(slug);
  redirect(`/admin/story/${slug}/lore`);
}

export async function updateLore(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  const storySlug = formData.get("storySlug") as string;
  const term = formData.get("term") as string;
  const category = (formData.get("category") as string) || null;
  const definition = formData.get("definition") as string;
  const aliases = (formData.get("aliases") as string) || null;

  const lore = await prisma.lore.update({
    where: { id },
    data: {
      term: term.trim(),
      category: category ? category.trim() : null,
      definition: definition.trim(),
      aliases: aliases ? aliases.trim() : null,
    },
    include: {
      story: { select: { slug: true } }
    }
  });

  await prisma.story.update({
    where: { id: lore.storyId },
    data: { updatedAt: new Date() }
  });

  const slug = lore.story?.slug || storySlug;
  revalidateAllLorePaths(slug);
  redirect(`/admin/story/${slug}/lore`);
}

export async function deleteLore(formData: FormData) {
  await requireAdmin();
  const id = formData.get("id") as string;
  const storySlug = formData.get("storySlug") as string;

  const lore = await prisma.lore.findUnique({
    where: { id },
    include: {
      story: { select: { id: true, slug: true } }
    }
  });

  if (lore) {
    await prisma.lore.delete({
      where: { id },
    });

    await prisma.story.update({
      where: { id: lore.storyId },
      data: { updatedAt: new Date() }
    });

    const slug = lore.story?.slug || storySlug;
    revalidateAllLorePaths(slug);
    redirect(`/admin/story/${slug}/lore`);
  } else {
    revalidateAllLorePaths(storySlug);
    redirect(`/admin/story/${storySlug}/lore`);
  }
}



