import { MetadataRoute } from "next";
import { headers } from "next/headers";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers();
  const host = headersList.get("host") || "thienthuai.com";
  const protocol = host.includes("localhost") ? "http" : "https";
  const baseUrl = process.env.NEXTAUTH_URL || `${protocol}://${host}`;

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/truyen/", "/tu-truyen", "/profile", "/nap-the"],
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
