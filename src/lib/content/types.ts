export interface GuideSection {
  id: string;
  heading: string;
  content: string;
  keyTakeaways?: string[];
  exampleQuestion?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface StudyGuide {
  slug: string;
  title: string;
  subject: string;
  level: "All" | "Professional" | "Subprofessional";
  description: string;
  readTimeMinutes: number;
  lastUpdated: string;
  tags: string[];
  sections: GuideSection[];
}

export interface Article {
  slug: string;
  title: string;
  category: "Strategy" | "Exam Overview" | "Preparation Tips";
  description: string;
  readTimeMinutes: number;
  publishedDate: string;
  author: string;
  keyHighlights: string[];
  content: string[];
}

export interface FAQItem {
  id: string;
  category:
    | "Qualifications & Eligibility"
    | "Exam Format & Scoring"
    | "Exam Day Guidelines"
    | "Preparation & Review";
  question: string;
  answer: string;
}
