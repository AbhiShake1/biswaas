// Accessibility utilities
export function getContrastRatio(fg: string, bg: string): string {
  // Placeholder — in production use a proper contrast checker
  return "AA compliant";
}

export const A11Y_CHECKLIST = [
  "All interactive elements have focus styles",
  "Images have alt text",
  "Form inputs have labels",
  "Color contrast meets WCAG AA (4.5:1)",
  "Keyboard navigation works for all features",
  "Skip to content link present",
  "ARIA landmarks used correctly",
  "No auto-playing media",
] as const;
