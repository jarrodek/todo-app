import { css } from 'lit';

export default [css`
:host {
  display: block;
  align-self: stretch;
}

.title-line {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 20px 0;
}

.list-title {
  flex: 1;
  margin: 0;
  padding: 0;
  color: var(--md-sys-color-on-surface);
  font-family: var(--md-sys-typescale-title-small-font-family-name);
  font-style: var(--md-sys-typescale-title-small-font-family-style);
  font-weight: var(--md-sys-typescale-title-small-font-weight);
  font-size: var(--md-sys-typescale-title-small-font-size);
  letter-spacing: var(--md-sys-typescale-title-small-tracking);
  line-height: var(--md-sys-typescale-title-small-height);
  text-transform: var(--md-sys-typescale-title-small-text-transform);
  text-decoration: var(--md-sys-typescale-title-small-text-decoration);
}

.container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  flex: 1 0 0px;
  align-self: stretch;
}

.input,
.buttons {
  width: 100%;
}

.done-checkbox label {
  display: flex;
  align-items: center;
}

.done-checkbox .checkbox-input {
  padding: 15px;
}
`];
