import { css } from '@emotion/react'

export const spiritDialogCss = css`
  font-size: 3.4em;
  padding: 0.7em 1.2em 1em;
  max-width: 26em;

  h2 {
    margin: 0 0 0.6em;
    /* Room for the dialog close button, which sits in the top-right corner */
    padding-right: 1.2em;
  }

  p {
    font-size: 0.9em;
    margin: 0;
    line-height: 1.5;
  }
`
