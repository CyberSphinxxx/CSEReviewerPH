import type { Metadata } from "next";
import { AuthPageLayout } from "@/components/auth/AuthPageLayout";

export const metadata: Metadata = {
  title: "Create Free Account — csereviewph.com",
  description:
    "Create your free Philippine Civil Service Exam reviewer account. Save your practice exam results, track weak areas, and sync study progress on any device.",
};

export default function CreateAccountPage() {
  return <AuthPageLayout mode="create-account" />;
}
