/** @jsxImportSource @emotion/react */
import { Sanctuary } from '@gamepark/faraway/cards/Sanctuary'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { MaterialLogProps, PlayMoveButton, usePlayerName } from '@gamepark/react-game'
import { FC } from 'react'
import { Trans } from 'react-i18next'
import { linkCss } from '../logStyles'
import { buildOpenItemHelpMove } from '../useOpenItemHelp'
import { MiniCard } from './MiniCard'

type Variant = 'place' | 'sacrifice'

type Props = MaterialLogProps & { variant: Variant }

/** Sanctuary move log: "<player> placed a sanctuary" / "<player>
 *  sacrificed a sanctuary" + mini-card. Both the link text and the
 *  mini-card open the same help dialog via displayMaterialHelp,
 *  dispatched through <PlayMoveButton transient>.
 *
 *  When the sanctuary id is hidden from this client (typical: another
 *  player placing or sacrificing), we skip the link + mini-card and
 *  fall back to a flat narration.
 */
export const SanctuaryMoveLog: FC<Props> = ({ move, context, variant }) => {
  const player = (move as any).location?.player ?? context.action.playerId
  const name = usePlayerName(player) || ''
  const rules = new FarawayRules(structuredClone(context.game))
  rules.play(move)
  const itemIndex = (move as any).itemIndex
  const item = rules.material(MaterialType.Sanctuary).getItem<Sanctuary>(itemIndex)
  const id = item?.id as Sanctuary | undefined
  const helpMove = buildOpenItemHelpMove(MaterialType.Sanctuary, item, itemIndex)

  const i18nKey = id === undefined
    ? `log.sanctuary.${variant}.unknown`
    : `log.sanctuary.${variant}`
  return (
    <Trans
      i18nKey={i18nKey}
      values={{ player: name }}
      components={{
        ref: <PlayMoveButton css={linkCss} move={helpMove} transient/>,
        card: id !== undefined
          ? <MiniCard itemType={MaterialType.Sanctuary} itemId={id} tiltRight={itemIndex % 2 === 1} move={helpMove}/>
          : <span/>
      }}
    />
  )
}
