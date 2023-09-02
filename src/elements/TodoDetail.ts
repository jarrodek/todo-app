/* eslint-disable import/no-duplicates */
import { LitElement, PropertyValues, TemplateResult, html } from "lit";
import { property, query, state } from "lit/decorators.js";
import { MdFilledTextField } from "@material/web/textfield/filled-text-field.js";
import { MdCheckbox } from "@material/web/checkbox/checkbox.js";
import { ITodoItem } from "../types/Db.js";
import store from '../lib/store.js';
import '@material/web/textfield/filled-text-field.js';
import '@material/web/button/outlined-button.js';
import '@material/web/button/filled-button.js';
import '@material/web/iconbutton/outlined-icon-button.js';
import '@material/web/icon/icon.js';
import '@material/web/checkbox/checkbox.js';
import { renderDoneCheckbox } from "../lib/common-ui.js";
import { AppEvents } from "../lib/events.js";

/**
 * @fires itemcomplete - Event dispatched when the user changes the "completed" checkbox value. The event bubbles and is cancelable.
 */
export default class TodoDetail extends LitElement {
  /**
   * The item to render. When not set it will not render the UI.
   */
  @property({ type: Object }) item?: ITodoItem;

  @state() itemTitle = '';

  @state() description = '';

  @state() done = false;

  @query('#submitter') readonly submitter!: HTMLInputElement;

  constructor() {
    super();
    // As we pass this function to the common template, the called handler
    // won't be in the same scope. We force it to bind to `this`.
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
  }

  protected override willUpdate(cp: PropertyValues<this>): void {
    if (cp.has('item')) {
      this.syncValues();
    }
    super.willUpdate(cp);
  }

  reset(): void {
    this.itemTitle = '';
    this.description = '';
    this.done = false;
  }

  syncValues(): void {
    const { item } = this;
    if (!item) {
      this.reset();
      return;
    }
    const { title, description = '', completed } = item;
    this.itemTitle = title;
    this.description = description;
    this.done = completed === 1;
  }

  protected handleSubmit(e: SubmitEvent): void {
    e.preventDefault();
    this.updateItem();
  }

  /**
   * Deletes the item from the database.
   */
  async deleteItem(): Promise<void> {
    const { item } = this;
    if (!item) {
      return;
    }
    await store.delete(item.id);
  }

  /**
   * Commits the edit values and updates the database.
   */
  async updateItem(): Promise<void> {
    const { item, itemTitle, description } = this;
    if (!item) {
      return;
    }
    if (!itemTitle) {
      throw new Error(`Title is required.`);
    }
    const copy = { ...item };
    copy.title = itemTitle;
    if (description) {
      copy.description = description;
    } else {
      delete copy.description;
    }
    await store.update(copy);
  }

  protected handleTitleChange(e: Event): void {
    const node = e.target as MdFilledTextField;
    const { value } = node;
    this.itemTitle = value;
    this.submitForm();
  }

  protected handleDescriptionChange(e: Event): void {
    const node = e.target as MdFilledTextField;
    const { value } = node;
    this.description = value
    this.submitForm();
  }

  protected submitForm(): void {
    this.submitter.click();
  }

  protected handleDelete(): void {
    this.deleteItem();
  }

  protected handleCheckboxChange(e: Event): void {
    const { item } = this;
    if (!item) {
      return;
    }
    const input = e.target as MdCheckbox;
    AppEvents.dispatchDone(item.id, input.checked, this);
  }

  protected override render(): TemplateResult {
    return html`
    ${this.renderTitleLine()}
    <form class="container" @submit="${this.handleSubmit}">
      ${this.renderDoneCheckbox()}
      ${this.renderTitleInput()}
      ${this.renderDescriptionInput()}
      <input type="submit" id="submitter" hidden />
    </form>
    `;
  }

  renderTitleLine(): TemplateResult {
    return html`
    <div class="title-line">
      ${this.renderTitle()}
      ${this.renderDeleteButton()}
    </div>
    `;
  }

  renderTitle(): TemplateResult {
    return html`<h2 class="list-title">Details</h2>`;
  }

  renderDeleteButton(): TemplateResult {
    return html`
    <md-outlined-icon-button 
      title="Delete this item"
      @click="${this.handleDelete}"
    >
      <md-icon>delete</md-icon>
    </md-outlined-icon-button>
    `;
  }

  renderDoneCheckbox(): TemplateResult {
    const { done } = this;
    const content = renderDoneCheckbox(this.handleCheckboxChange, done ? 1 : 0);
    return html`
    <div class="done-checkbox">
      <label>
        ${content}
        Mark as done
      </label>
    </div>
    `;
  }

  renderTitleInput(): TemplateResult {
    const { itemTitle = '' } = this;
    return html`
    <md-filled-text-field 
      label="Title" 
      .value="${itemTitle}" 
      required 
      class="input"
      @change="${this.handleTitleChange}"
    ></md-filled-text-field>
    `;
  }

  renderDescriptionInput(): TemplateResult {
    const { description = '' } = this;
    return html`
    <md-filled-text-field 
      label="Description (optional)" 
      .value="${description}" 
      class="input"
      @change="${this.handleDescriptionChange}"
    ></md-filled-text-field>
    `;
  }
}
