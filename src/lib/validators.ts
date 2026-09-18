// Local format: exactly 10 digits (e.g. 0771741600)
// International format: "+" followed by exactly 12 digits (e.g. +254115774307)
const PHONE_RE = /^(?:\d{10}|\+\d{12})$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidPhone(value: string): boolean {
  return PHONE_RE.test(value.trim());
}

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

// A "contact" field may hold either a phone number or an email address.
export function isValidContact(value: string): boolean {
  return isValidPhone(value) || isValidEmail(value);
}

// Keeps only characters a phone number can contain, and caps length to the
// longest valid format (+ and 12 digits = 13 characters) so the field can't
// run past what isValidPhone will ever accept.
export function sanitizePhoneInput(value: string): string {
  const hasPlus = value.trim().startsWith("+");
  const digits = value.replace(/[^\d]/g, "");
  const maxDigits = hasPlus ? 12 : 10;
  return (hasPlus ? "+" : "") + digits.slice(0, maxDigits);
}

export function phoneError(value: string): string {
  if (!value.trim()) return "";
  return isValidPhone(value)
    ? ""
    : "Enter exactly 10 digits (0771741600) or +254 format with 12 digits (+254115774307).";
}

export function emailError(value: string): string {
  if (!value.trim()) return "";
  return isValidEmail(value) ? "" : "Enter a valid email, e.g. name@email.com.";
}

export function contactError(value: string): string {
  if (!value.trim()) return "";
  return isValidContact(value) ? "" : "Enter a valid phone number or email address.";
}
