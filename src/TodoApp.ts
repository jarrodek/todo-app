/* eslint-disable class-methods-use-this */
import { LitElement, html, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/iconbutton/filled-tonal-icon-button.js';
import '@material/web/button/filled-tonal-button.js';
import store, { DB_BROADCAST } from './lib/store.js';
import { IDataEvent, ITodoItem } from './types/Db.js';
import { sortItems } from './lib/lists.js';
import './elements/todo-item.js';
import './elements/todo-detail.js';
import { ItemCompleteEvent } from './lib/events.js';

export class TodoApp extends LitElement {
  /**
   * Whether the application was initialized.
   */
  @state() protected initialized = false;

  /**
   * The list of pending items to render.
   */
  @state() items: ITodoItem[] = [];

  /**
   * The list of completed items to render.
   */
  @state() completed: ITodoItem[] = [];

  storeChannel = new BroadcastChannel(DB_BROADCAST);

  /**
   * The currently selected todo item in the UI.
   */
  @state() activeItem: ITodoItem | undefined;

  constructor() {
    super();
    // This event is added to the `window` object manually so 
    // we need to `bind` it's scope to `this`.
    this.handleUiComplete = this.handleUiComplete.bind(this);
  }

  override connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener(ItemCompleteEvent, this.handleUiComplete);
    this.initializeApp();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener(ItemCompleteEvent, this.handleUiComplete);
  }

  async initializeApp(): Promise<void> {
    if (this.initialized) {
      return;
    }
    this.storeChannel.addEventListener('message', this.handleStoreEvent.bind(this));
    const items = await store.list({ completed: false });
    this.items = items.sort(sortItems);
    const completed = await store.list({ completed: true });
    this.completed = completed.sort(sortItems);
    this.initialized = true;
  }

  /**
   * The handler for the store's broadcast event.
   */
  protected handleStoreEvent(e: MessageEvent<IDataEvent>): void {
    const { data } = e;
    switch (data.type) {
      case 'create': this.handleItemCreated(data.item as ITodoItem); break;
      case 'delete': this.handleItemDeleted(data.id); break;
      case 'update': this.handleItemUpdated(data.item as ITodoItem); break;
      case 'complete': this.handleItemComplete(data.item as ITodoItem); break;
      case 'incomplete': this.handleItemIncomplete(data.item as ITodoItem); break;
      default: 
        // eslint-disable-next-line no-console
        console.warn(`Unknown store event`, data);
    }
  }

  /**
   * A handler for the data store delete event. 
   * @param id The id of the item that was deleted.
   */
  handleItemDeleted(id: string): void {
    const { completed, items } = this;
    let updated = false;
    const itemsIndex = items.findIndex(i => i.id === id);
    const completedIndex = completed.findIndex(i => i.id === id);
    if (itemsIndex >= 0) {
      items.splice(itemsIndex, 1);
      updated = true;
    }
    if (completedIndex >= 0) {
      completed.splice(completedIndex, 1);
      updated = true;
    }
    if (updated) {
      this.requestUpdate();
    }
    const { activeItem } = this;
    if (activeItem && activeItem.id === id) {
      this.activeItem = undefined;
    }
  }

  /**
   * A handler for the `create` data store event.
   * @param item The created item
   */
  handleItemCreated(item: ITodoItem): void {
    const list = item.completed === 1 ? this.completed : this.items;
    list.push(item);
    this.activeItem = item;
    this.requestUpdate();
  }

  /**
   * Handles the `updated` event of the data store.
   * Note, the event is not dispatched when the items is marked complete/incomplete.
   * @param item The updated item.
   */
  handleItemUpdated(item: ITodoItem): void {
    let updated = false;
    const itemsIndex = this.items.findIndex(i => i.id === item.id);
    if (itemsIndex >= 0) {
      this.items.splice(itemsIndex, 1, item);
      updated = true;
    }
    if (!updated) {
      const completedIndex = this.completed.findIndex(i => i.id === item.id);
      if (completedIndex >= 0) {
        this.completed.splice(completedIndex, 1, item);
        updated = true;
      }
    }
    if (updated) {
      this.requestUpdate();
    }
    const { activeItem } = this;
    if (activeItem && activeItem.id === item.id) {
      this.activeItem = item;
    }
  }

  /**
   * Moves the item from `items` to `completed`.
   */
  handleItemComplete(item: ITodoItem): void {
    this.moveItem(item, this.items, this.completed);
  }

  /**
   * Moves the item from `completed` to `items`.
   */
  handleItemIncomplete(item: ITodoItem): void {
    this.moveItem(item, this.completed, this.items);
  }

  /**
   * The handler for the item complete custom event dispatched by any of the components.
   * The detail value contains the required information about the todo item and the new state.
   */
  handleUiComplete(e: CustomEvent<{value: boolean, id: string}>): void {
    const { id, value } = e.detail;
    if (value) {
      store.markComplete(id);
    } else {
      store.markIncomplete(id);
    }
  }

  private moveItem(item: ITodoItem, from: ITodoItem[], to: ITodoItem[]): void {
    const index = from.findIndex(i => i.id === item.id);
    if (index < 0) {
      return;
    }
    from.splice(index, 1);
    to.push(item);
    to.sort(sortItems);
    this.requestUpdate();

    const { activeItem } = this;
    if (activeItem && activeItem.id === item.id) {
      this.activeItem = item;
    }
  }

  /**
   * A handler for the "add item" button click.
   */
  protected handleAdd(): void {
    this.addEmptyItem();
  }

  /**
   * Adds a new, empty item to the store.
   */
  async addEmptyItem(): Promise<void> {
    await store.add({
      completed: 0,
      title: '',
    });
  }

  protected handleItemClick(e: Event): void {
    const node = e.target as HTMLElement;
    const { id } = node.dataset;
    if (!id) {
      return;
    }
    this.selectItem(id);
  }

  selectItem(id: string): void {
    let item = this.items.find(i => i.id === id);
    if (!item) {
      item = this.completed.find(i => i.id === id);
    }
    this.activeItem = item;
  }

  override render() {
    if (!this.initialized) {
      return this.renderLoader();
    }
    return this.renderMain();
  }

  renderLoader(): TemplateResult {
    return html`
      <div class="page-loader">
        <p class="message">Preparing your tasks.</p>
        <progress aria-label="Loading application"></progress>
      </div>
    `;
  }

  renderHeader(): TemplateResult {
    return html`
    <header>
      <span class="app-title">To-do list by BigTechTalks</span>
      <md-filled-tonal-icon-button @click="${this.handleAdd}">
        <md-icon>add</md-icon>
      </md-filled-tonal-icon-button>
    </header>
    `;
  }

  renderMain(): TemplateResult {
    const { items, completed } = this;
    if (!items.length && !completed.length) {
      return this.renderEmptyScreen();
    }
    return this.renderContent();
  }

  renderEmptyScreen(): TemplateResult {
    return html`
    ${this.renderHeader()}
    <main class="empty">
      <h1 class="empty-header">Your list is empty</h1>
      <md-filled-tonal-button @click="${this.handleAdd}">Add item</md-filled-tonal-button>
    </main>
    `;
  }

  renderContent(): TemplateResult {
    return html`
    ${this.renderHeader()}
    <main class="content">
      <section class="list">
        <h2 class="list-title">To-do items</h2>
        ${this.renderItems(this.items)}
        <h2 class="list-title">Completed items</h2>
        ${this.renderItems(this.completed)}
      </section>
      <section class="details">
        ${this.renderDetail()}
      </section>
    </main>
    `;
  }

  renderItems(items: ITodoItem[]): TemplateResult {
    if (!items.length) {
      return html`
      <p class="empty-list">No items to show.</p>
      `;
    }
    return html`
    ${items.map(i => this.renderItem(i))}
    `;
  }

  renderItem(item: ITodoItem): TemplateResult {
    const { activeItem } = this;
    const isActive = !!activeItem && activeItem.id === item.id;
    return html`
    <todo-item 
      .item="${item}" 
      .selected="${isActive}" 
      @click="${this.handleItemClick}"></todo-item>
    `;
  }

  renderDetail(): TemplateResult {
    const { activeItem } = this;
    if (!activeItem) {
      return this.renderEmptyDetails();
    }
    return html`<todo-detail .item="${this.activeItem}"></todo-detail>`;
  }

  renderEmptyDetails(): TemplateResult {
    return html`
      <p class="empty-list">Select an item to see the details.</p>
      `;
  }
}
