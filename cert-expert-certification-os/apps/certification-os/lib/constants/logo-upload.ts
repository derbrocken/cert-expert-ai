/** Shared logo upload limit for Document Generator Server Actions (B4.5a, raised in B4.5b). */
export const LOGO_MAX_BYTES = 10 * 1024 * 1024;
export const LOGO_MAX_SIZE_LABEL = "10 MB";

export function formatLogoSizeMb(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function logoSizeErrorMessage(bytes: number): string {
  return `Logo must be ${LOGO_MAX_SIZE_LABEL} or smaller (selected: ${formatLogoSizeMb(bytes)}).`;
}
