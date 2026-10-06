/** Google Fonts family names where they differ from the label shown in a case. */
const GOOGLE_FAMILY: Record<string, string> = { Golos: 'Golos Text' };
export const clientFamily = (font: string) => GOOGLE_FAMILY[font] || font;
