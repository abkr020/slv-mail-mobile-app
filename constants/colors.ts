export type ThemeMode = "light" | "dark";

export type ThemeColors = {
  background: string;
  card: string;
  text: string;
  mutedText: string;
  primary: string;
  secondary: string;
  danger: string;
  inputBorder: string;
  border: string;
  overlay: string;
  surface: string;
  cardBackgroundColor: string;
  sideBarBackgroundColor: string;
  sideBarListBackgroundColor: string;
};

export const lightTheme: ThemeColors = {
  // Surfaces
  background: "#E7EDF4",           // page bg — unchanged, works well
  card: "#FFFFFF",                 // card — unchanged
  surface: "#F8FAFC",              // subtle surface — unchanged
  cardBackgroundColor: "#F8FAFC",  // unchanged

  // Typography
  text: "#0D1117",                 // primary text — AAA contrast ✓
  mutedText: "#667085",            // muted — AA contrast, don't use below 14px

  // Brand & actions
  primary: "#2563EB",              // blue — unchanged, great
  secondary: "#7C3AED",            // FIX: was #14B8A6 (teal reads as "success")
  //      violet has no semantic baggage
  danger: "#DC2626",               // red — unchanged

  // Borders & inputs
  inputBorder: "#CBD5E1",          // unchanged
  border: "#CBD5E1",               // unchanged

  // Overlay
  overlay: "rgba(15, 23, 42, 0.08)", // unchanged

  // Sidebar — FIX: was #7b93aa / #618fbd (too close in tone to app bg,
  //                white text contrast failed AA on list bg)
  sideBarBackgroundColor: "#3D5A73",
  sideBarListBackgroundColor: "#2E4A61",
};

export const darkTheme: ThemeColors = {
  // Surfaces — all unchanged, excellent layering
  background: "#0B0F14",           // deepest bg
  surface: "#111827",              // main surfaces
  card: "#1F2937",                 // cards
  cardBackgroundColor: "#1F2937",

  // Typography — unchanged
  text: "#E5E7EB",                 // primary text — AAA ✓
  mutedText: "#9CA3AF",            // muted — verify at small sizes on #0B0F14

  // Brand & actions
  primary: "#3B82F6",              // blue — unchanged
  secondary: "#8B5CF6",            // FIX: was #22C55E (pure green = success in UX convention)
  //      violet pairs cleanly with the blue primary
  danger: "#EF4444",               // red — unchanged

  // Borders & inputs — unchanged
  border: "#374151",
  inputBorder: "#4B5563",

  // Overlay — unchanged
  overlay: "rgba(0, 0, 0, 0.6)",

  // Sidebar — unchanged, these are already great
  sideBarBackgroundColor: "#0F172A",
  sideBarListBackgroundColor: "#1E293B",
};

export const colors = lightTheme;