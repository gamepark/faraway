import { css } from '@emotion/react'


export const resource = (image: string) => css`
  ${icon(image)}
  width: 1em;
`

export const icon = (image: string) => css`
  flex: 1;
  align-self: center;
  background-image: url(${image});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 1.5em;
  height: 1.5em;
  margin-bottom: -0.4em;
  display:inline-block; 
`

export const radius = (percent: number) => css`
  border-radius: ${percent}%;
`