export interface ITodoItem {
  /**
   * The key of the todo item.
   */
  id: string;
  /**
   * The title of the item.
   */
  title: string;
  /**
   * The description of the item.
   */
  description?: string;
  /**
   * The timestamp when the item was created.
   */
  created: number;
  /**
   * The timestamp when the item was last updated.
   */
  updated: number;
  /**
   * The note color rendered in the UI.
   * (probably implement this in the future ;)
   */
  color?: string;
  /**
   * The timestamp of when the todo item should be completed.
   */
  completeBy?: number;
  /**
   * IDB does not support boolean values as keys.
   * In this database, 0 means not completed, 1 means completed.
   */
  completed: number;
}

export type ITodoItemCreate = Omit<ITodoItem, "created" | "updated" | "id">;

export interface IListOptions {
  /**
   * Whether to list completed items.
   * @default false
   */
  completed?: boolean;
}

export interface IDataEvent {
  /**
   * The type of the event.
   */
  type: 'create' | 'update' | 'delete' | 'complete' | 'incomplete';
  /**
   * The id of the changed record.
   */
  id: string;
  /**
   * For "created" and "updated" events 
   * this is always set to the corresponding 
   * data object.
   */
  item?: unknown;
}
