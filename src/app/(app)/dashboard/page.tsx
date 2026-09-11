import { DashboardView } from "@/features/dashboard/DashboardView";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Dashboard — Philippine Civil Service Exam Reviewer",
  description: "User dashboard, test readiness, study streaks, and performance analytics.",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1">
        <DashboardView />
      </main>
      <Footer />
    </div>
  );
}
