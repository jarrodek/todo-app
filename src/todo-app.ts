import { customElement } from "lit/decorators.js";
import { TodoApp } from './TodoApp.js';
import styles from './TodoApp.styles.js';

@customElement('todo-app')
export class TodoAppElement extends TodoApp {
  static override styles = [...styles];
}

declare global {
  interface HTMLElementTagNameMap {
    'todo-app': Element;
  }
}
