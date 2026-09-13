import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/env";
import { SEED_TOPICS, SEED_LEVELS } from "@/db/seed-data";
import { getAllStudyGuides, getAllArticles } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const currentDate = new Date();

  // 1. Core platform pages
  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/practice`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/exam-info`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cse/exam-guide`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...[
      "schedule",
      "testing-centers",
      "how-to-apply",
      "requirements",
      "exam-day",
      "results",
      "official-links",
    ].map((section) => ({
      url: `${baseUrl}/cse/exam-guide/${section}`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // 2. Exam simulation modes per level
  const examRoutes: MetadataRoute.Sitemap = [];
  for (const level of SEED_LEVELS) {
    for (const mode of ["quick", "medium", "full"]) {
      examRoutes.push({
        url: `${baseUrl}/exams/${level.slug}/${mode}`,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: mode === "full" ? 0.9 : 0.8,
      });
    }
  }

  // 3. Topic-specific practice modules
  const topicRoutes: MetadataRoute.Sitemap = SEED_TOPICS.map((topic) => ({
    url: `${baseUrl}/practice/${topic.id}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // 4. Study Guides (Catalog and individual subtest guides)
  const studyGuides = getAllStudyGuides();
  const guideRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/guides`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...studyGuides.map((guide) => ({
      url: `${baseUrl}/guides/${guide.slug}`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  // 5. Strategic Preparation Articles
  const articles = getAllArticles();
  const articleRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/articles`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...articles.map((article) => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  // 6. Trust, legal, and AdSense compliance pages
  const trustAndLegalRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  return [
    ...coreRoutes,
    ...examRoutes,
    ...topicRoutes,
    ...guideRoutes,
    ...articleRoutes,
    ...trustAndLegalRoutes,
  ];
}
