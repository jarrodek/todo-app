export const ItemCompleteEvent = 'itemcomplete';

export class AppEvents {
  /**
   * @param id The to-do item id.
   * @param value `true` when marked as done and `false` otherwise.
   * @param target The node on which to dispatch the event. Defaults to the body element.
   */
  static dispatchDone(id: string, value: boolean, target: EventTarget = document.body): void {
    target.dispatchEvent(new CustomEvent(ItemCompleteEvent, {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: { value, id },
    }));
  }
}


declare global {
  interface WindowEventMap {
    'itemcomplete': CustomEvent<{ value: boolean, id: string }>;
  }
}
