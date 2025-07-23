const primary = "#2f1385";

const lightenHex = (hex: string, percent: number): string => {
  hex = hex.replace(/^#/, "");

  let num = parseInt(hex, 16);
  let r = (num >> 16) + Math.round((255 - (num >> 16)) * (percent / 100));
  let g =
    ((num >> 8) & 0x00ff) +
    Math.round((255 - ((num >> 8) & 0x00ff)) * (percent / 100));
  let b =
    (num & 0x0000ff) + Math.round((255 - (num & 0x0000ff)) * (percent / 100));

  return `#${(
    (1 << 24) |
    ((r < 255 ? r : 255) << 16) |
    ((g < 255 ? g : 255) << 8) |
    (b < 255 ? b : 255)
  )
    .toString(16)
    .slice(1)}`;
};

const darkenHex = (hex: string, percent: number): string => {
  hex = hex.replace(/^#/, "");

  let num = parseInt(hex, 16);
  let r = (num >> 16) - Math.round((num >> 16) * (percent / 100));
  let g =
    ((num >> 8) & 0x00ff) - Math.round(((num >> 8) & 0x00ff) * (percent / 100));
  let b = (num & 0x0000ff) - Math.round((num & 0x0000ff) * (percent / 100));

  return `#${(
    (1 << 24) |
    ((r > 0 ? r : 0) << 16) |
    ((g > 0 ? g : 0) << 8) |
    (b > 0 ? b : 0)
  )
    .toString(16)
    .slice(1)}`;
};

export const COLORS = {
  siteBackground: "#F1F3F5",
  sidebarColor: "#",
  pureWhite: "#FFFFFF",
  pureBlack: "#000000",
  lightFont: "#9C9EA1",
  font: "#4f4f4f",
  darkPrimary: darkenHex(primary, 25),
  lightPrimary: lightenHex(primary, 95),
  primary: primary,

  lightGrey: "#efefef",
  mediumGrey: "#d9d9d9",
  darkGrey: "#c4c4c4",
  calendarBlue: "#1087ff",
  deleteRed: "#E63946",
  darkDeleteRed: "#D32F2F",
  background: "#fafafa",
  green: "#2dcc2d",
  darkGreen: "#1e8f1e",
};

export const SPACING = {
  spacingBase: "4px",
  spacing2x: "8px",
  spacing3x: "12px",
  spacing4x: "16px",
  spacing5x: "20px",
  spacing6x: "24px",
  spacing7x: "28px",
  spacing8x: "32px",
  spacing9x: "36px",
  spacing10x: "40px",
};

export const FONTSIZE = {
  xs: "12px",
  sm: "14px",
  md: "16px",
  lg: "18px",
  ml: "24px",
  xl: "32px;",
};
