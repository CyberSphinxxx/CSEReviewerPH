import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SignInPage from "@/app/(public)/sign-in/page";
import CreateAccountPage from "@/app/(public)/create-account/page";
import ForgotPasswordPage from "@/app/(public)/forgot-password/page";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// Mock better-auth client
vi.mock("@/lib/auth/auth-client", () => ({
  signIn: { email: vi.fn() },
  signUp: { email: vi.fn() },
  requestPasswordReset: vi.fn(),
}));

describe("Dedicated Auth Pages", () => {
  it("renders /sign-in page with 2-column benefit preview and sign in form", () => {
    render(<SignInPage />);

    expect(screen.getByText("Keep your study progress with you.")).toBeInTheDocument();
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your password")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Back to practice/i })).toHaveAttribute("href", "/practice");
  });

  it("renders /create-account page with create account mode", () => {
    render(<CreateAccountPage />);

    expect(screen.getByText("Keep your study progress with you.")).toBeInTheDocument();
    expect(screen.getByText("Create your free account")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Juan Dela Cruz")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("At least 8 characters")).toBeInTheDocument();
  });

  it("renders /forgot-password page with reset form", () => {
    render(<ForgotPasswordPage />);

    expect(screen.getByText("Keep your study progress with you.")).toBeInTheDocument();
    expect(screen.getByText("Reset your password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send Reset Link/i })).toBeInTheDocument();
  });
});
