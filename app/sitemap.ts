import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://yealth.mu",
    },
    {
      url: "https://yealth.mu/calculator",
    },
    {
      url: "https://yealth.mu/terms",
    },
    {
      url: "https://yealth.mu/privacy",
    },
  ];
}
