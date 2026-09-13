import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AuthModal } from "@/components/auth/AuthModal";

// Mock better-auth client functions
vi.mock("@/lib/auth/auth-client", () => ({
  signIn: {
    email: vi.fn().mockResolvedValue({ data: { user: { id: "1" } } }),
  },
  signUp: {
    email: vi.fn().mockResolvedValue({ data: { user: { id: "1" } } }),
  },
  requestPasswordReset: vi.fn().mockResolvedValue({ data: { success: true } }),
}));

describe("AuthModal Component — Guest First & RA 10173 Compliance", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("does not render when isOpen is false", () => {
    const { container } = render(<AuthModal isOpen={false} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders Sign In modal with 'Welcome back', email, password, and RA 10173 disclosure", () => {
    render(<AuthModal isOpen={true} onClose={() => {}} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(screen.getByText("Sign in to sync your study progress across devices.")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/juan@example\.ph/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument();
    expect(screen.getByText(/Forgot password\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Continue without an account/i)).toBeInTheDocument();
    expect(screen.getByText(/Data Privacy:/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Sign In$/i })).toBeInTheDocument();
  });

  it("toggles password visibility when show/hide button is clicked", () => {
    render(<AuthModal isOpen={true} onClose={() => {}} />);

    const passwordInput = screen.getByPlaceholderText(/Enter your password/i);
    expect(passwordInput).toHaveAttribute("type", "password");

    const toggleBtn = screen.getByRole("button", { name: /Show password/i });
    fireEvent.click(toggleBtn);

    expect(passwordInput).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: /Hide password/i })).toBeInTheDocument();
  });

  it("switches to Create Account mode and reveals display name input", () => {
    render(<AuthModal isOpen={true} onClose={() => {}} />);

    const createBtn = screen.getByRole("button", { name: /Create a free account/i });
    fireEvent.click(createBtn);

    expect(screen.getByText("Create your free account")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Juan Dela Cruz")).toBeInTheDocument();
    expect(screen.getByText(/This is how your name appears in your reviewer profile\./i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/At least 8 characters/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create Account & Sync/i })).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onCloseMock = vi.fn();
    render(<AuthModal isOpen={true} onClose={onCloseMock} />);

    const closeBtn = screen.getByRole("button", { name: /Close dialog/i });
    fireEvent.click(closeBtn);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape key is pressed", () => {
    const onCloseMock = vi.fn();
    render(<AuthModal isOpen={true} onClose={onCloseMock} />);

    fireEvent.keyDown(window, { key: "Escape" });
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when 'Continue without an account' is clicked", () => {
    const onCloseMock = vi.fn();
    render(<AuthModal isOpen={true} onClose={onCloseMock} />);

    const guestBtn = screen.getByRole("button", { name: /Continue without an account/i });
    fireEvent.click(guestBtn);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
