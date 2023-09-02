/* eslint-disable import/no-duplicates */
import { LitElement, TemplateResult, html, nothing, PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { MdCheckbox } from "@material/web/checkbox/checkbox.js";
import { ITodoItem } from "../types/Db.js";
import '@material/web/checkbox/checkbox.js';
import { renderDoneCheckbox } from "../lib/common-ui.js";
import { AppEvents } from "../lib/events.js";

/**
 * @fires itemcomplete - Event dispatched when the user changes the "completed" checkbox value. The event bubbles and is cancelable.
 */
export default class TodoItem extends LitElement {
  /**
   * The item to render. When not set it will not render the UI.
   */
  @property({ type: Object }) item?: ITodoItem;

  /**
   * Whether the item should be rendered in the selected state.
   * @attribute
   */
  @property({ type: Boolean, reflect: true }) selected?: boolean;

  constructor() {
    super();
    // As we pass this function to the common template, the called handler
    // won't be in the same scope. We force it to bind to `this`.
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  protected override updated(cp: PropertyValues<this>): void {
    super.updated(cp);
    if (cp.has('item')) {
      this.syncId();
    }
  }

  syncId(): void {
    const { item } = this;
    if (!item) {
      this.removeAttribute('data-id');
    } else {
      this.setAttribute('data-id', item.id);
    }
  }

  protected handleCheckboxChange(e: Event): void {
    const { item } = this;
    if (!item) {
      return;
    }
    const input = e.target as MdCheckbox;
    AppEvents.dispatchDone(item.id, input.checked, this);
  }

  protected override render(): TemplateResult | typeof nothing {
    const { item } = this;
    if (!item) {
      return nothing;
    }
    
    const { completed, title, description, id } = item;
    const classes = {
      container: true,
      completed: completed === 1,
    };
    return html`
    <div class="${classMap(classes)}" data-id="${id}">
      <div class="title">
        ${this.renderCheckbox(completed)}
        ${this.renderTitle(title)}
      </div>
      ${this.renderDescription(description)}
    </div>
    `;
  }

  renderCheckbox(completed?: number): TemplateResult {
    const content = renderDoneCheckbox(this.handleCheckboxChange, completed);
    return html`
    <span class="checkbox">
      ${content}
    </span>
    `;
  }

  renderTitle(title: string): TemplateResult {
    return html`
    <span class="title-label">${title || 'New to-do item'}</span>
    `;
  }

  renderDescription(description?: string): TemplateResult | typeof nothing {
    if (!description) {
      return nothing;
    }
    return html`
    <div class="description">${description}</div>
    `;
  }
}
