import { html } from "lit";
import { lensSpinner } from "./lens-spinner";

/**
 * Renders a full loading indicator with lens spinner and text
 * @param text Loading message to display
 * @param size Size of the spinner in pixels
 * @returns Lit HTML template for the loading indicator
 */
export const loadingIndicator = (text = "Loading...", size = 28) => {
  return html`
    <div class="loading-indicator">
      ${lensSpinner(size)}
      <div class="loading-indicator__text">${text}</div>
    </div>
  `;
};
