import { css } from 'lit';

export default [css`
:host {
  min-height: 100vh;
  display: flex;
  align-items: stretch;
  margin: 0px auto;
  flex-direction: column;
  user-select: none;
}

header {
  display: flex;
  padding: 8px 20px;
  align-items: center;
  gap: 12px;
  background: var(--md-sys-color-surface);
}

.app-title {
  color: var(--md-sys-color-on-surface);
  font-family: var(--md-sys-typescale-title-large-font-family-name);
  font-size: var(--md-sys-typescale-title-large-font-size);
  font-style: var(--md-sys-typescale-title-large-font-family-style);
  font-weight: var(--md-sys-typescale-title-large-font-weight);
  line-height: var(--md-sys-typescale-title-large-line-height);
  flex: 1;
}

main {
  flex-grow: 1;
}

main.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.empty-header {
  font-family: var(--md-sys-typescale-display-large-font-family-name);
  font-style: var(--md-sys-typescale-display-large-font-family-style);
  font-weight: var(--md-sys-typescale-display-large-font-weight);
  font-size: var(--md-sys-typescale-display-large-font-size);
  letter-spacing: var(--md-sys-typescale-display-large-tracking);
  line-height: var(--md-sys-typescale-display-large-height);
  text-transform: var(--md-sys-typescale-display-large-text-transform);
  text-decoration: var(--md-sys-typescale-display-large-text-decoration);
  color: var(--md-sys-color-on-background, #201A1C);
  margin: 20px 0;
}

main.content {
  display: flex;
  padding: 20px;
  align-items: flex-start;
  gap: 40px;
  flex: 1 0 0;
}

.details,
.list {
  display: flex;
  padding: 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  flex: 1 0 0;
  align-self: stretch;
}

.details {
  border-radius: 20px;
  background: var(--md-sys-color-surface);
  /* border: 1px var(--md-sys-color-surface-variant) solid; */
}

.empty-list {
  margin: 0;
  padding: 0;
  color: var(--md-sys-color-on-background);
  font-family: var(--md-sys-typescale-body-medium-font-family-name);
  font-style: var(--md-sys-typescale-body-medium-font-family-style);
  font-weight: var(--md-sys-typescale-body-medium-font-weight);
  font-size: var(--md-sys-typescale-body-medium-font-size);
  letter-spacing: var(--md-sys-typescale-body-medium-tracking);
  line-height: var(--md-sys-typescale-body-medium-height);
  text-transform: var(--md-sys-typescale-body-medium-text-transform);
  text-decoration: var(--md-sys-typescale-body-medium-text-decoration);
}

.list-title {
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

.page-loader {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;

  font-family: var(--md-sys-typescale-body-large-font-family-name);
  font-style: var(--md-sys-typescale-body-large-font-family-style);
  font-weight: var(--md-sys-typescale-body-large-font-weight);
  font-size: var(--md-sys-typescale-body-large-font-size);
  letter-spacing: var(--md-sys-typescale-body-large-tracking);
  line-height: var(--md-sys-typescale-body-large-height);
  text-transform: var(--md-sys-typescale-body-large-text-transform);
  text-decoration: var(--md-sys-typescale-body-large-text-decoration);
}
`];
