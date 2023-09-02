import { TemplateResult, html } from "lit";
import { live } from 'lit/directives/live.js'

export function renderDoneCheckbox(handler: (event: Event) => void, completed?: number): TemplateResult {
  const done = completed === 1;
  const label = done ? 'Mark item as not completed' : 'Mark item as completed';
  return html`
    <md-checkbox 
      aria-label="${label}" 
      .checked=${live(done)} 
      class="checkbox-input"
      @change="${handler}"
      @click="${(e: Event) => e.stopPropagation()}"
    ></md-checkbox>
  `;
}
