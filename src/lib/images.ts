/**
 * Utility functions for story covers and character avatars
 * Rule: Prioritize Cloudinary CDN URLs, fallback to local /public assets if absent or offline
 */

/**
 * Slugify Vietnamese / English text to file-friendly names
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Resolves story cover image URL
 * 1. Prioritizes Cloudinary CDN URL (story.coverUrl)
 * 2. Fallbacks to local /covers/{slug}.jpg
 */
export function getStoryCoverUrl(coverUrl?: string | null, slug?: string): string {
  if (coverUrl && coverUrl.trim().length > 0) {
    return coverUrl.trim();
  }
  if (slug) {
    return `/covers/${slug}.jpg`;
  }
  return "/covers/default-cover.jpg";
}

/**
 * Resolves character avatar image URL
 * 1. Prioritizes Cloudinary CDN URL (char.avatarUrl)
 * 2. Fallbacks to local /characters/{storySlug}/{charSlug}.jpg if storySlug & name are given
 */
export function getCharacterAvatarUrl(
  avatarUrl?: string | null,
  storySlug?: string,
  charName?: string
): string | null {
  if (avatarUrl && avatarUrl.trim().length > 0) {
    return avatarUrl.trim();
  }
  if (storySlug && charName) {
    const charSlug = slugify(charName);
    return `/characters/${storySlug}/${charSlug}.jpg`;
  }
  return null;
}
