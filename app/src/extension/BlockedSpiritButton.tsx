import { css } from '@emotion/react'
import { faExclamation } from '@fortawesome/free-solid-svg-icons/faExclamation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ItemMenuButton, RulesDialog } from '@gamepark/react-game'
import { FC, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { spiritDialogCss } from './spiritDialogCss'

/**
 * Button on an available Spirit whose conditions the player satisfies, but which they cannot take because none of the cards
 * played this turn is part of the conditions. The dialog explains that rule, which players easily take for a bug.
 */
export const BlockedSpiritButton: FC = () => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const label = t('button.spirit.blocked')
  return (
    <>
      <ItemMenuButton x={-2.5} y={-3.5} css={buttonCss} onClick={() => setOpen(true)} aria-label={label} title={label}>
        <FontAwesomeIcon icon={faExclamation}/>
      </ItemMenuButton>
      <RulesDialog open={open} close={() => setOpen(false)}>
        <div css={spiritDialogCss}>
          <h2><Trans i18nKey="help.spirit.blocked.title"/></h2>
          <p><Trans i18nKey="help.spirit.blocked.rule" components={[<strong/>]}/></p>
        </div>
      </RulesDialog>
    </>
  )
}

const buttonCss = css`
  background-color: #c0392b;
  color: #fff;
  box-shadow: 0 0.1em 0.2em rgba(0, 0, 0, 0.5);
`
