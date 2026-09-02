export const ORGANISER_EMAILS = new Set([
  "e.kingsford@outlook.com",
  "eo.kingsford@gmail.com",
]);

export function isOrganiserEmail(email: string) {
  return ORGANISER_EMAILS.has(email.trim().toLowerCase());
}
