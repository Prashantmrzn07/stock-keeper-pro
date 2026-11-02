import { describe, it, expect } from "vitest";
import {
  normalizeNepalPhone,
  isValidNepalPhone,
  formatNepalPhone,
  formatNepalPhoneInput,
} from "@/lib/nepal-phone";

describe("Nepal phone standard", () => {
  it("accepts a 10-digit NTC/CELL mobile starting with 9", () => {
    expect(isValidNepalPhone("9841234567")).toBe(true);
    expect(isValidNepalPhone("97 412 34567")).toBe(true);
  });

  it("accepts +977 and 00977 prefixed numbers", () => {
    expect(isValidNepalPhone("+977 98 412 34567")).toBe(true);
    expect(isValidNepalPhone("009779841234567")).toBe(true);
    expect(normalizeNepalPhone("9779841234567")).toBe("9841234567");
  });

  it("accepts Kathmandu and Pokhara landlines", () => {
    expect(isValidNepalPhone("01-4567890")).toBe(true);
    expect(isValidNepalPhone("061-456789")).toBe(true);
    expect(isValidNepalPhone("+977 1 4567890")).toBe(true);
    expect(isValidNepalPhone("14567890")).toBe(false);
  });

  it("rejects foreign, short and landline-looking-but-wrong numbers", () => {
    expect(isValidNepalPhone("+1-555-0101")).toBe(false);
    expect(isValidNepalPhone("12345")).toBe(false);
    expect(isValidNepalPhone("841234567")).toBe(false);
    expect(isValidNepalPhone("")).toBe(false);
    expect(isValidNepalPhone("98412345678")).toBe(false);
  });

  it("displays mobiles with +977 and landlines with area code", () => {
    expect(formatNepalPhone("9841234567")).toBe("+977 98 412 34567");
    expect(formatNepalPhone("+977 98 412 34567")).toBe("+977 98 412 34567");
    expect(formatNepalPhone("014567890")).toBe("01-4567890");
    expect(formatNepalPhone("061456789")).toBe("061-456789");
  });

  it("groups digits while typing", () => {
    expect(formatNepalPhoneInput("9841234567")).toBe("98 412 34567");
    expect(formatNepalPhoneInput("98412")).toBe("98 412");
    expect(formatNepalPhoneInput("014567890")).toBe("01-4567890");
    expect(formatNepalPhoneInput("0")).toBe("0");
    expect(formatNepalPhoneInput("")).toBe("");
  });
});
