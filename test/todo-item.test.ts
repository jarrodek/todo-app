import { html } from 'lit';
import { fixture, assert } from '@open-wc/testing';
import TodoItem from '../src/elements/TodoItem.js';
import '../src/elements/todo-item.js';

describe('todo-item', () => {
  describe('item is not set', () => {
    let element: TodoItem;
    beforeEach(async () => {
      element = await fixture(html`<todo-item></todo-item>`);
    });

    it('does not render the local DOM', () => {
      const container = element.shadowRoot!.querySelector('.container');
      assert.ok(container)
    });
  });
});
