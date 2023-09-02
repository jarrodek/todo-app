import { customElement } from "lit/decorators.js";
import Element from "./TodoDetail.js";
import styles from './TodoDetail.styles.js';

@customElement('todo-detail')
export class TodoDetailElement extends Element {
  static override styles = [...styles];
}

declare global {
  interface HTMLElementTagNameMap {
    'todo-detail': Element;
  }
}
