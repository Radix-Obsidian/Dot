import { html } from "lit";

/**
 * Renders a lens icon spinner component using the SVG lens icon
 * @param size Size of the spinner in pixels
 * @param color Optional color (uses currentColor by default)
 * @returns Lit HTML template for the lens spinner
 */
export const lensSpinner = (size = 24, color?: string) => {
  return html`
    <div 
      class="lens-spinner" 
      style="width: ${size}px; height: ${size}px; ${color ? `color: ${color};` : ''}"
    >
      <img src="/images/lens-icon.svg" alt="Loading" />
    </div>
  `;
};
