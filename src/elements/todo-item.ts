import { customElement } from "lit/decorators.js";
import Element from "./TodoItem.js";
import styles from './TodoItem.styles.js';

@customElement('todo-item')
export class TodoItemElement extends Element {
  static override styles = [...styles];
}

declare global {
  interface HTMLElementTagNameMap {
    'todo-item': Element;
  }
}
