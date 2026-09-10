export * from "./types";
export * from "./faqs";
export * from "./guides";
export * from "./articles";

import { STUDY_GUIDES } from "./guides";
import { ARTICLES } from "./articles";
import { FAQS } from "./faqs";

export function getStudyGuideBySlug(slug: string) {
  return STUDY_GUIDES.find((g) => g.slug === slug) || null;
}

export function getArticleBySlug(slug: string) {
  return ARTICLES.find((a) => a.slug === slug) || null;
}

export function getAllStudyGuides() {
  return STUDY_GUIDES;
}

export function getAllArticles() {
  return ARTICLES;
}

export function getAllFaqs() {
  return FAQS;
}
