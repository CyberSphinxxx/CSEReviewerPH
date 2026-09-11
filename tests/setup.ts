import "@testing-library/jest-dom";
import { vi } from "vitest";

if (typeof HTMLCanvasElement !== "undefined") {
  HTMLCanvasElement.prototype.getContext = (() => ({
    fillRect: () => {},
    clearRect: () => {},
    getImageData: () => ({ data: [] }),
    putImageData: () => {},
    createImageData: () => [],
    setTransform: () => {},
    drawImage: () => {},
    save: () => {},
    fillText: () => {},
    restore: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    stroke: () => {},
    translate: () => {},
    scale: () => {},
    rotate: () => {},
    arc: () => {},
    fill: () => {},
    measureText: () => ({ width: 0 }),
    transform: () => {},
    rect: () => {},
    clip: () => {},
  })) as unknown as typeof HTMLCanvasElement.prototype.getContext;

  HTMLCanvasElement.prototype.toDataURL = () => "";
}

// Global mock for better-auth client to prevent hanging network calls and nanostores teardown errors
vi.mock("@/lib/auth/auth-client", () => ({
  authClient: {
    useSession: () => ({ data: null, isPending: false }),
    signIn: { email: vi.fn() },
    signUp: { email: vi.fn() },
    signOut: vi.fn(),
  },
  useSession: () => ({
    data: null,
    isPending: false,
    refetch: vi.fn(),
  }),
  signIn: { email: vi.fn() },
  signUp: { email: vi.fn() },
  signOut: vi.fn(),
}));
