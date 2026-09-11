import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { UserNav } from "@/components/auth/UserNav";
import { useSession, signOut } from "@/lib/auth/auth-client";

vi.mock("@/lib/auth/auth-client", () => ({
  useSession: vi.fn(),
  signOut: vi.fn(),
  signIn: { email: vi.fn() },
  signUp: { email: vi.fn() },
}));

type SessionHookResult = ReturnType<typeof useSession>;

describe("UserNav Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders 'Sign In' button when examinee is unauthenticated", () => {
    vi.mocked(useSession).mockReturnValue({
      data: null,
      isPending: false,
      refetch: vi.fn(),
    } as unknown as SessionHookResult);

    render(<UserNav />);

    const signInBtn = screen.getByRole("button", { name: /Sign In/i });
    expect(signInBtn).toBeInTheDocument();
  });

  it("opens AuthModal when 'Sign In' is clicked", () => {
    vi.mocked(useSession).mockReturnValue({
      data: null,
      isPending: false,
      refetch: vi.fn(),
    } as unknown as SessionHookResult);

    render(<UserNav />);

    const signInBtn = screen.getByRole("button", { name: /Sign In/i });
    fireEvent.click(signInBtn);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/Sign In to Sync Progress/i)).toBeInTheDocument();
  });

  it("renders user initials and opens dropdown with sync & RA 10173 options when authenticated", () => {
    vi.mocked(useSession).mockReturnValue({
      data: {
        user: {
          id: "u-123",
          name: "Juan Dela Cruz",
          email: "juan@example.ph",
        },
        session: { id: "s-123" },
      },
      isPending: false,
      refetch: vi.fn(),
    } as unknown as SessionHookResult);

    render(<UserNav />);

    expect(screen.getByText("JD")).toBeInTheDocument();
    expect(screen.getByText(/Juan Dela Cruz/i)).toBeInTheDocument();

    const triggerBtn = screen.getByRole("button", { name: /User account menu/i });
    fireEvent.click(triggerBtn);

    expect(screen.getByText("Sync Offline Progress")).toBeInTheDocument();
    expect(screen.getByText(/Export My Data \(RA 10173\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Delete Account & Data/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sign Out/i })).toBeInTheDocument();
  });

  it("invokes signOut when 'Sign Out' is clicked", async () => {
    vi.mocked(useSession).mockReturnValue({
      data: {
        user: {
          id: "u-123",
          name: "Juan Dela Cruz",
          email: "juan@example.ph",
        },
        session: { id: "s-123" },
      },
      isPending: false,
      refetch: vi.fn(),
    } as unknown as SessionHookResult);

    render(<UserNav />);

    const triggerBtn = screen.getByRole("button", { name: /User account menu/i });
    fireEvent.click(triggerBtn);

    const signOutBtn = screen.getByRole("button", { name: /Sign Out/i });
    await act(async () => {
      fireEvent.click(signOutBtn);
    });

    expect(signOut).toHaveBeenCalledTimes(1);
  });
});
