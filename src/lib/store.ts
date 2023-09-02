import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { IDataEvent, IListOptions, ITodoItem, ITodoItemCreate } from '../types/Db.js';

interface TodoDB extends DBSchema {
  items: {
    value: ITodoItem;
    key: string;
    indexes: { 'by-complete': number };
  };
}

export const DB_BROADCAST = 'todo-broadcast';

class TodoStore {
  #ref?: IDBPDatabase<TodoDB>;

  channel = new BroadcastChannel(DB_BROADCAST);

  /**
   * Opens the data store if not previously opened and returns the reference to it.
   * @returns The reference to the data store.
   */
  async open(): Promise<IDBPDatabase<TodoDB>> {
    if (!this.#ref) {
      this.#ref = await openDB<TodoDB>('ToDoApp', 1, {
        upgrade: this.upgrade.bind(this),
      });
    }
    return this.#ref;
  }

  /**
   * Creates the data store when the upgrade is requested.
   * @param db The reference to the datastore with the "upgrade" transaction active.
   */
  private upgrade(db: IDBPDatabase<TodoDB>): void {
    const itemsStore = db.createObjectStore('items', {
      keyPath: 'id',
    });
    itemsStore.createIndex('by-complete', 'completed');
  }

  /**
   * Lists todo items from the store.
   * @param opts The list options.
   * @returns The list of todo items for given query.
   */
  async list(opts: IListOptions = {}): Promise<ITodoItem[]> {
    const { completed = false } = opts;
    const db = await this.open();
    const tx = db.transaction('items', 'readonly');
    const index = tx.store.index('by-complete');
    const items = await index.getAll(completed ? 1 : 0);
    return items;
  }

  /**
   * Creates a new TODO item.
   * 
   * @param item The item definition to create.
   * @returns The **copy** of the created item with updated properties.
   */
  async add(item: ITodoItemCreate): Promise<ITodoItem> {
    const created = Date.now();
    const id = window.crypto.randomUUID();
    const cp = { ...item, created, updated: created, id, } as ITodoItem;
    if (typeof cp.completed !== 'number') {
      cp.completed = 0;
    }
    const db = await this.open();
    await db.add('items', cp);

    const event: IDataEvent = {
      type: 'create',
      id,
      item: { ...cp },
    }
    this.channel.postMessage(event);

    return cp;
  }

  /**
   * Marks an item as completed.
   * @param id The id of the item to mark as completed
   * @returns The updated item.
   */
  markComplete(id: string): Promise<ITodoItem> {
    return this.updateComplete(id, 1);
  }

  /**
   * Marks an item as incomplete.
   * @param id The id of the item to mark as incomplete.
   * @returns The updated item.
   */
  markIncomplete(id: string): Promise<ITodoItem> {
    return this.updateComplete(id, 0);
  }

  private async updateComplete(id: string, completed: number): Promise<ITodoItem> {
    const db = await this.open();
    const tx = db.transaction('items', 'readwrite');
    const item = await tx.store.get(id);
    if (!item) {
      throw new RangeError(`The item with the id ${id} not found.`);
    }
    item.completed = completed;
    await tx.store.put(item);
    await tx.done;

    const event: IDataEvent = {
      type: completed === 0 ? 'incomplete' : 'complete',
      id: item.id,
      item: { ...item },
    }
    this.channel.postMessage(event);
    return item;
  }

  /**
   * Updates a record in the data store.
   * This will not check for whether the item is 
   * the last saved revision of the item and will always
   * insert the passed value to the store.
   * 
   * @param item The item to update.
   * @returns The copy of updated item.
   */
  async update(item: ITodoItem): Promise<ITodoItem> {
    const updated = Date.now();
    const cp = { ...item, updated } as ITodoItem;
    const db = await this.open();
    const tx = db.transaction('items', 'readwrite');
    await tx.store.put(cp);
    await tx.done;

    const event: IDataEvent = {
      type: 'update',
      id: item.id,
      item: { ...cp },
    }
    this.channel.postMessage(event);

    return cp;
  }

  /**
   * Permanently deletes the object from the data store.
   * @param id The id of the record to delete
   */
  async delete(id: string): Promise<void> {
    const db = await this.open();
    const tx = db.transaction('items', 'readwrite');
    // OK, this likely should be marked as "deleted"
    // through a data property so the user can restore
    // the item from "trash" (or whatever) later on.
    // For the simplicity, though, I will delete the item.
    await tx.store.delete(id);
    await tx.done;

    const event: IDataEvent = {
      type: 'delete',
      id,
    }
    this.channel.postMessage(event);
  }
}

const instance = new TodoStore();
export default instance;
