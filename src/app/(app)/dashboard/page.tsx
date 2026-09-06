import { DashboardView } from "@/features/dashboard/DashboardView";

export const metadata = {
  title: "Dashboard — Philippine Civil Service Exam Reviewer",
  description: "User dashboard, test readiness, study streaks, and performance analytics.",
};

export default function DashboardPage() {
  return <DashboardView />;
}
