import { css } from 'lit';

export default [css`
:host {
  display: block;
  border-radius: 20px;
  align-self: stretch;
}

.container {
  display: flex;
  padding: 12px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  
  border-radius: inherit;
  background: var(--md-sys-color-surface);
}

.checkbox {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  display: inline-flex;
}

.title {
  display: flex;
  padding-right: 0px;
  align-items: center;
  gap: 12px;
  align-self: stretch;
}

.title-label {
  color: var(--md-sys-color-on-surface, #201A1C);
  font-family: var(--md-sys-typescale-title-medium-font-family-name);
  font-style: var(--md-sys-typescale-title-medium-font-family-style);
  font-weight: var(--md-sys-typescale-title-medium-font-weight);
  font-size: var(--md-sys-typescale-title-medium-font-size);
  letter-spacing: var(--md-sys-typescale-title-medium-tracking);
  line-height: var(--md-sys-typescale-title-medium-height);
  text-transform: var(--md-sys-typescale-title-medium-text-transform);
  text-decoration: var(--md-sys-typescale-title-medium-text-decoration);
}

.description {
  display: flex;
  padding: 0px 12px;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  flex: 1 0 0;

  color: var(--md-sys-color-on-surface, #201A1C);

  font-family: var(--md-sys-typescale-body-medium-font-family-name);
  font-style: var(--md-sys-typescale-body-medium-font-family-style);
  font-weight: var(--md-sys-typescale-body-medium-font-weight);
  font-size: var(--md-sys-typescale-body-medium-font-size);
  letter-spacing: var(--md-sys-typescale-body-medium-tracking);
  line-height: var(--md-sys-typescale-body-medium-height);
  text-transform: var(--md-sys-typescale-body-medium-text-transform);
  text-decoration: var(--md-sys-typescale-body-medium-text-decoration);
}

:host([selected]) .container {
  background: var(--md-sys-color-primary);
  --md-checkbox-outline-color: var(--md-sys-color-on-primary);
  --md-checkbox-hover-outline-color: var(--md-sys-color-on-primary);
  --md-checkbox-pressed-outline-color: var(--md-sys-color-on-primary);
  --md-checkbox-selected-hover-container-color: var(--md-sys-color-on-primary);
  --md-checkbox-selected-hover-icon-color: var(--md-sys-color-primary);
}

:host([selected]) .title-label,
:host([selected]) .description {
  color: var(--md-sys-color-on-primary);
}

:host([selected]) .completed {
  --md-checkbox-selected-container-color: var(--md-sys-color-on-primary);
  --md-checkbox-selected-icon-color: var(--md-sys-color-primary);
}

.completed {
  text-decoration: line-through;
}
`];
