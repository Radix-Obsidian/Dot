import { html } from "lit";
import { lensSpinner } from "../components/lens-spinner";

/**
 * Renders a button with loading state using the lens spinner
 */
export const loadingButton = (
  isLoading: boolean, 
  text: string, 
  loadingText = "Loading…", 
  className = "btn", 
  disabled = false,
  onClick?: () => void
) => {
  return html`
    <button 
      class="${className}" 
      ?disabled=${isLoading || disabled} 
      @click=${onClick}
    >
      ${isLoading 
        ? html`<span class="loading-text">${lensSpinner(16)} ${loadingText}</span>` 
        : text
      }
    </button>
  `;
};
