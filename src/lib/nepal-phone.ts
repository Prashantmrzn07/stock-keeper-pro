/**
 * Nepal phone number rules.
 *
 * Mobile: 10 digits starting with 9 (94/95/96/97/98 prefixes), e.g. 9841234567.
 * Landline: national format starting with 0 + area code, e.g. 01-4567890 (Kathmandu),
 * 061-XXXXXXX (Pokhara), 021-XXXXXX (Biratnagar).
 * International dialling prefix +977 / 00977 is accepted on input.
 */

const MOBILE = /^9[4-9]\d{8}$/;
const LANDLINE = /^0[1-9]\d{7,8}$/;

/** Strip separators and the Nepal country code, returning bare national digits. */
export function normalizeNepalPhone(raw: string): string {
  let digits = (raw || "").replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("977") && digits.length > 10) digits = digits.slice(3);
  digits = digits.replace(/\D/g, "");
  // Subscriber number without the trunk 0, e.g. "14567890" -> "014567890"
  if (digits && !digits.startsWith("0") && !digits.startsWith("9")) digits = "0" + digits;
  return digits;
}

export function isNepalMobile(raw: string): boolean {
  return MOBILE.test(normalizeNepalPhone(raw));
}

export function isNepalLandline(raw: string): boolean {
  return LANDLINE.test(normalizeNepalPhone(raw));
}

export function isValidNepalPhone(raw: string): boolean {
  const value = (raw || "").trim();
  if (!value) return false;
  return isNepalMobile(value) || isNepalLandline(value);
}

function areaCodeOf(digits: string): string {
  return digits.startsWith("01") ? digits.slice(0, 2) : digits.slice(0, 3);
}

/** Display form: "+977 98 412 34567" for mobiles, "01-4567890" for landlines. */
export function formatNepalPhone(raw: string): string {
  const digits = normalizeNepalPhone(raw);
  if (MOBILE.test(digits)) {
    return `+977 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  }
  if (LANDLINE.test(digits)) {
    const area = areaCodeOf(digits);
    return `${area}-${digits.slice(area.length)}`;
  }
  return (raw || "").trim();
}

/** Live typing format: groups digits as they are entered. */
export function formatNepalPhoneInput(raw: string): string {
  const digits = normalizeNepalPhone(raw);
  if (!digits) return "";
  if (MOBILE.test(digits) || digits.startsWith("9")) {
    return [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 10)].filter(Boolean).join(" ");
  }
  if (digits.startsWith("0")) {
    const area = areaCodeOf(digits);
    const rest = digits.slice(area.length, area.length + 7);
    return digits.length > area.length ? `${area}-${rest}` : area;
  }
  return digits;
}
