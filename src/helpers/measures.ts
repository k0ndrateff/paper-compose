// DOCX library counts in half-points, so this utility converts it back to points
export const pt = (points: number): number => points * 2;

// DOCX library counts in twips, so this utility converts it to centimeters
export const cm = (cm: number): number => cm * 567;
