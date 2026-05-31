import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://genibiz.com",
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: "https://genibiz.com/pro",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
