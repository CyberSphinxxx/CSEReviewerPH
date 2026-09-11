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

  it("renders Sign In modal with email, password, and RA 10173 disclosure", () => {
    render(<AuthModal isOpen={true} onClose={() => {}} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/Sign In to Sync Progress/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/juan@example\.ph/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/At least 8 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/Data Privacy \(RA 10173\)/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Sign In$/i })).toBeInTheDocument();
  });

  it("switches to Create Account mode and reveals display name input", () => {
    render(<AuthModal isOpen={true} onClose={() => {}} />);

    const createBtn = screen.getByRole("button", { name: /Create free account/i });
    fireEvent.click(createBtn);

    expect(screen.getByText(/Create Reviewer Account/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Juan Dela Cruz/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create Account & Sync/i })).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onCloseMock = vi.fn();
    render(<AuthModal isOpen={true} onClose={onCloseMock} />);

    const closeBtn = screen.getByRole("button", { name: /Close dialog/i });
    fireEvent.click(closeBtn);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
