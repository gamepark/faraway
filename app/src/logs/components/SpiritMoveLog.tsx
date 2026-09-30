/** @jsxImportSource @emotion/react */
import { Spirit } from '@gamepark/faraway/cards/Spirit'
import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { MaterialLogProps, PlayMoveButton, usePlayerName } from '@gamepark/react-game'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { linkCss } from '../logStyles'
import { buildOpenItemHelpMove } from '../useOpenItemHelp'
import { MiniCard } from './MiniCard'

/** Beyond the Veil: "<player> took the <spirit> Spirit" + mini-card. */
export const SpiritMoveLog: FC<MaterialLogProps> = ({ move, context }) => {
  const player = (move as any).location?.player ?? context.action.playerId
  const name = usePlayerName(player) || ''
  const rules = new FarawayRules(structuredClone(context.game))
  rules.play(move)
  const itemIndex = (move as any).itemIndex
  const item = rules.material(MaterialType.Spirit).getItem<Spirit>(itemIndex)
  const helpMove = buildOpenItemHelpMove(MaterialType.Spirit, item, itemIndex)
  return (
    <Trans
      i18nKey="log.spirit.take"
      values={{ player: name }}
      components={{
        ref: <PlayMoveButton css={linkCss} move={helpMove} transient/>,
        card: <MiniCard itemType={MaterialType.Spirit} itemId={item.id} tiltRight={itemIndex % 2 === 1} move={helpMove}/>
      }}
    />
  )
}
