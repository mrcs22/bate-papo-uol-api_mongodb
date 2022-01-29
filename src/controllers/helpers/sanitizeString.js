import { stripHtml } from "string-strip-html";

export default function sanitizeString(string) {
  if (typeof string !== "string") {
    return "";
  }

  const removedHtmlString = stripHtml(string).result;

  return removedHtmlString.trim();
}
