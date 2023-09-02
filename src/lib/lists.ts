import { ITodoItem } from "../types/Db.js";

/**
 * A function that sorts the todo items on a list.
 */
export function sortItems(a: ITodoItem, b: ITodoItem): number {
  return a.created - b.created;
}
