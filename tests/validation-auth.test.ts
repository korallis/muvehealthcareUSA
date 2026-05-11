import { describe, it, expect } from "vitest";
import {
  signupSchema,
  loginSchema,
  passwordSchema,
} from "@/lib/validation/auth";

describe("passwordSchema", () => {
  it("rejects passwords shorter than 8 characters", () => {
    const result = passwordSchema.safeParse("Ab1");
    expect(result.success).toBe(false);
  });

  it("rejects passwords without uppercase", () => {
    const result = passwordSchema.safeParse("abcdefg1");
    expect(result.success).toBe(false);
  });

  it("rejects passwords without lowercase", () => {
    const result = passwordSchema.safeParse("ABCDEFG1");
    expect(result.success).toBe(false);
  });

  it("rejects passwords without numbers", () => {
    const result = passwordSchema.safeParse("Abcdefgh");
    expect(result.success).toBe(false);
  });

  it("accepts valid passwords", () => {
    const result = passwordSchema.safeParse("ValidPass1");
    expect(result.success).toBe(true);
  });
});

describe("signupSchema", () => {
  it("validates a correct signup payload", () => {
    const result = signupSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "ValidPass1",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = signupSchema.safeParse({
      name: "",
      email: "john@example.com",
      password: "ValidPass1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = signupSchema.safeParse({
      name: "John",
      email: "not-an-email",
      password: "ValidPass1",
    });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("validates correct login payload", () => {
    const result = loginSchema.safeParse({
      email: "john@example.com",
      password: "anypassword",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({
      email: "john@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});
