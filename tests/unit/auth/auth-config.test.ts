import { describe, it, expect } from "vitest";
import { auth } from "@/lib/auth";
import { authClient, signIn, signUp, signOut, useSession } from "@/lib/auth/auth-client";

describe("Better Auth Configuration & Client Setup", () => {
  it("initializes server auth instance with Drizzle adapter and email/password provider", () => {
    expect(auth).toBeDefined();
    expect(auth.handler).toBeDefined();
    expect(typeof auth.handler).toBe("function");
    expect(auth.api).toBeDefined();
    expect(typeof auth.api.getSession).toBe("function");
    expect(typeof auth.api.signInEmail).toBe("function");
    expect(typeof auth.api.signUpEmail).toBe("function");
  });

  it("exports client-side auth client and authentication hooks", () => {
    expect(authClient).toBeDefined();
    expect(signIn).toBeDefined();
    expect(signUp).toBeDefined();
    expect(typeof signOut).toBe("function");
    expect(typeof useSession).toBe("function");
  });
});
