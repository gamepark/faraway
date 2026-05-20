import { Region } from '@gamepark/faraway/cards/Region'
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { Memory } from '@gamepark/faraway/rules/Memory'
import { css, keyframes } from '@emotion/react'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faArrowUp } from '@fortawesome/free-solid-svg-icons/faArrowUp'
import { CardDescription, ItemContext, MaterialContext } from '@gamepark/react-game'
import { isMoveItemType, MaterialItem, MaterialMove, MaterialMoveBuilder } from '@gamepark/rules-api'
import { FarawayMenuButton, HandIcon, TrashIcon } from '../components/ItemMenuButton'
import Blue13 from '../images/region/region_blue_13.jpg'
import Blue17 from '../images/region/region_blue_17.jpg'
import Blue2 from '../images/region/region_blue_2.jpg'
import Blue21 from '../images/region/region_blue_21.jpg'
import Blue24 from '../images/region/region_blue_24.jpg'
import Blue40 from '../images/region/region_blue_40.jpg'
import Blue43 from '../images/region/region_blue_43.jpg'
import Blue46 from '../images/region/region_blue_46.jpg'
import Blue49 from '../images/region/region_blue_49.jpg'
import Blue51 from '../images/region/region_blue_51.jpg'
import Blue55 from '../images/region/region_blue_55.jpg'
import Blue6 from '../images/region/region_blue_6.jpg'
import Blue60 from '../images/region/region_blue_60.jpg'
import Blue64 from '../images/region/region_blue_64.jpg'
import Blue66 from '../images/region/region_blue_66.jpg'
import Blue68 from '../images/region/region_blue_68.jpg'
import Blue9 from '../images/region/region_blue_9.jpg'
import BlueExp75 from '../images/region/region_blue_exp_75.jpg'
import RegionBack from '../images/region/region_card_back.jpg'
import GrayExp0 from '../images/region/region_gray_exp_0.jpg'
import GrayExp70 from '../images/region/region_gray_exp_70.jpg'
import GrayExp72 from '../images/region/region_gray_exp_72.jpg'
import GrayExp74 from '../images/region/region_gray_exp_74.jpg'
import GrayExp76 from '../images/region/region_gray_exp_76.jpg'
import Green11 from '../images/region/region_green_11.jpg'
import Green15 from '../images/region/region_green_15.jpg'
import Green18 from '../images/region/region_green_18.jpg'
import Green20 from '../images/region/region_green_20.jpg'
import Green22 from '../images/region/region_green_22.jpg'
import Green3 from '../images/region/region_green_3.jpg'
import Green34 from '../images/region/region_green_34.jpg'
import Green38 from '../images/region/region_green_38.jpg'
import Green41 from '../images/region/region_green_41.jpg'
import Green45 from '../images/region/region_green_45.jpg'
import Green5 from '../images/region/region_green_5.jpg'
import Green54 from '../images/region/region_green_54.jpg'
import Green58 from '../images/region/region_green_58.jpg'
import Green61 from '../images/region/region_green_61.jpg'
import Green63 from '../images/region/region_green_63.jpg'
import Green67 from '../images/region/region_green_67.jpg'
import Green8 from '../images/region/region_green_8.jpg'
import GreenExp71 from '../images/region/region_green_exp_71.jpg'
import Red1 from '../images/region/region_red_1.jpg'
import Red10 from '../images/region/region_red_10.jpg'
import Red14 from '../images/region/region_red_14.jpg'
import Red16 from '../images/region/region_red_16.jpg'
import Red19 from '../images/region/region_red_19.jpg'
import Red23 from '../images/region/region_red_23.jpg'
import Red26 from '../images/region/region_red_26.jpg'
import Red28 from '../images/region/region_red_28.jpg'
import Red30 from '../images/region/region_red_30.jpg'
import Red32 from '../images/region/region_red_32.jpg'
import Red36 from '../images/region/region_red_36.jpg'
import Red39 from '../images/region/region_red_39.jpg'
import Red4 from '../images/region/region_red_4.jpg'
import Red48 from '../images/region/region_red_48.jpg'
import Red52 from '../images/region/region_red_52.jpg'
import Red57 from '../images/region/region_red_57.jpg'
import Red7 from '../images/region/region_red_7.jpg'
import RedExp69 from '../images/region/region_red_exp_69.jpg'
import Yellow12 from '../images/region/region_yellow_12.jpg'
import Yellow25 from '../images/region/region_yellow_25.jpg'
import Yellow27 from '../images/region/region_yellow_27.jpg'
import Yellow29 from '../images/region/region_yellow_29.jpg'
import Yellow31 from '../images/region/region_yellow_31.jpg'
import Yellow33 from '../images/region/region_yellow_33.jpg'
import Yellow35 from '../images/region/region_yellow_35.jpg'
import Yellow37 from '../images/region/region_yellow_37.jpg'
import Yellow42 from '../images/region/region_yellow_42.jpg'
import Yellow44 from '../images/region/region_yellow_44.jpg'
import Yellow47 from '../images/region/region_yellow_47.jpg'
import Yellow50 from '../images/region/region_yellow_50.jpg'
import Yellow53 from '../images/region/region_yellow_53.jpg'
import Yellow56 from '../images/region/region_yellow_56.jpg'
import Yellow59 from '../images/region/region_yellow_59.jpg'
import Yellow62 from '../images/region/region_yellow_62.jpg'
import Yellow65 from '../images/region/region_yellow_65.jpg'
import YellowExp73 from '../images/region/region_yellow_exp_73.jpg'
// Starry Skies extension
import BlueSky15 from '../images/region/starrySkies/region_starrySkies_blue_15.jpg'
import BlueSky27 from '../images/region/starrySkies/region_starrySkies_blue_27.jpg'
import BlueSky32 from '../images/region/starrySkies/region_starrySkies_blue_32.jpg'
import GraySky7 from '../images/region/starrySkies/region_starrySkies_gray_7.jpg'
import GraySky13 from '../images/region/starrySkies/region_starrySkies_gray_13.jpg'
import GraySky29 from '../images/region/starrySkies/region_starrySkies_gray_29.jpg'
import GreenSky9 from '../images/region/starrySkies/region_starrySkies_green_9.jpg'
import GreenSky26 from '../images/region/starrySkies/region_starrySkies_green_26.jpg'
import GreenSky33 from '../images/region/starrySkies/region_starrySkies_green_33.jpg'
import RedSky5 from '../images/region/starrySkies/region_starrySkies_red_5.jpg'
import RedSky11 from '../images/region/starrySkies/region_starrySkies_red_11.jpg'
import RedSky21 from '../images/region/starrySkies/region_starrySkies_red_21.jpg'
import YellowSky4 from '../images/region/starrySkies/region_starrySkies_yellow_4.jpg'
import YellowSky20 from '../images/region/starrySkies/region_starrySkies_yellow_20.jpg'
import YellowSky38 from '../images/region/starrySkies/region_starrySkies_yellow_38.jpg'
import { RegionCardHelp } from './help/RegionCardHelp'

export class RegionCardDescription extends CardDescription {
  height = 7
  width = 7
  borderRadius = 0.5

  backImage = RegionBack

  images = {
    [Region.Red1]: Red1,
    [Region.Red4]: Red4,
    [Region.Red7]: Red7,
    [Region.Red10]: Red10,
    [Region.Red14]: Red14,
    [Region.Red16]: Red16,
    [Region.Red19]: Red19,
    [Region.Red23]: Red23,
    [Region.Red26]: Red26,
    [Region.Red28]: Red28,
    [Region.Red30]: Red30,
    [Region.Red32]: Red32,
    [Region.Red36]: Red36,
    [Region.Red39]: Red39,
    [Region.Red48]: Red48,
    [Region.Red52]: Red52,
    [Region.Red57]: Red57,
    [Region.Green3]: Green3,
    [Region.Green5]: Green5,
    [Region.Green8]: Green8,
    [Region.Green11]: Green11,
    [Region.Green15]: Green15,
    [Region.Green18]: Green18,
    [Region.Green20]: Green20,
    [Region.Green22]: Green22,
    [Region.Green34]: Green34,
    [Region.Green38]: Green38,
    [Region.Green41]: Green41,
    [Region.Green45]: Green45,
    [Region.Green54]: Green54,
    [Region.Green58]: Green58,
    [Region.Green61]: Green61,
    [Region.Green63]: Green63,
    [Region.Green67]: Green67,
    [Region.Blue2]: Blue2,
    [Region.Blue6]: Blue6,
    [Region.Blue9]: Blue9,
    [Region.Blue13]: Blue13,
    [Region.Blue17]: Blue17,
    [Region.Blue21]: Blue21,
    [Region.Blue24]: Blue24,
    [Region.Blue40]: Blue40,
    [Region.Blue43]: Blue43,
    [Region.Blue46]: Blue46,
    [Region.Blue49]: Blue49,
    [Region.Blue51]: Blue51,
    [Region.Blue55]: Blue55,
    [Region.Blue60]: Blue60,
    [Region.Blue64]: Blue64,
    [Region.Blue66]: Blue66,
    [Region.Blue68]: Blue68,
    [Region.Yellow12]: Yellow12,
    [Region.Yellow25]: Yellow25,
    [Region.Yellow27]: Yellow27,
    [Region.Yellow29]: Yellow29,
    [Region.Yellow31]: Yellow31,
    [Region.Yellow33]: Yellow33,
    [Region.Yellow35]: Yellow35,
    [Region.Yellow37]: Yellow37,
    [Region.Yellow42]: Yellow42,
    [Region.Yellow44]: Yellow44,
    [Region.Yellow47]: Yellow47,
    [Region.Yellow50]: Yellow50,
    [Region.Yellow53]: Yellow53,
    [Region.Yellow56]: Yellow56,
    [Region.Yellow59]: Yellow59,
    [Region.Yellow62]: Yellow62,
    [Region.Yellow65]: Yellow65,

    //Expansion
    [Region.RedExp69]: RedExp69,
    [Region.GreenExp71]: GreenExp71,
    [Region.BlueExp75]: BlueExp75,
    [Region.YellowExp73]: YellowExp73,
    [Region.GrayExp0]: GrayExp0,
    [Region.GrayExp70]: GrayExp70,
    [Region.GrayExp72]: GrayExp72,
    [Region.GrayExp74]: GrayExp74,
    [Region.GrayExp76]: GrayExp76,

    // Starry Skies
    [Region.RedSky5]: RedSky5,
    [Region.RedSky11]: RedSky11,
    [Region.RedSky21]: RedSky21,
    [Region.GreenSky9]: GreenSky9,
    [Region.GreenSky26]: GreenSky26,
    [Region.GreenSky33]: GreenSky33,
    [Region.BlueSky15]: BlueSky15,
    [Region.BlueSky27]: BlueSky27,
    [Region.BlueSky32]: BlueSky32,
    [Region.YellowSky4]: YellowSky4,
    [Region.YellowSky20]: YellowSky20,
    [Region.YellowSky38]: YellowSky38,
    [Region.GraySky7]: GraySky7,
    [Region.GraySky13]: GraySky13,
    [Region.GraySky29]: GraySky29,
  }

  // Clicking a card in the discard opens the discard location help (a grid
  // listing every discarded card with click-through), not that single card's
  // own help.
  displayHelp(item: MaterialItem, context: ItemContext) {
    if (item.location.type === LocationType.RegionDiscard) {
      return MaterialMoveBuilder.displayLocationHelp(item.location)
    }
    return super.displayHelp(item, context)
  }

  getLocations(item: MaterialItem, context: ItemContext) {
    if (item.location.type !== LocationType.PlayerRegionLine) return []
    // Show the score bubble only on cards that have already been resolved by ScoringRule.
    // The rule iterates from x=7 down to x=0, so a card has been scored iff its x is
    // strictly greater than the current scoring x. Once scoring is over (memory cleared)
    // every card has been resolved.
    if (!isResolvedRegion(item, context)) return []
    return [{
      type: LocationType.RegionScorePoints,
      parent: context.index
    }]
  }

  isFlippedOnTable(item: MaterialItem, context: ItemContext) {
    return this.isFlipped(item, context) || (item.location.type === LocationType.PlayerRegionLine && !item.location.rotation)
  }

  // While ScoringRule is iterating x → 0, the card sitting at the current x is the
  // one being resolved (across all players, simultaneously). We paint a pulsing
  // golden halo on it — same visual whether we're in Scoring proper, the
  // SacrificeSanctuary sub-rule, or HideRegionLine right before the decompte starts.
  getItemExtraCss(item: MaterialItem, context: ItemContext) {
    if (isCurrentlyResolvingRegion(item, context)) {
      return currentlyResolvingCss
    }
    return
  }

  menuAlwaysVisible = true

  getItemMenu(item: MaterialItem, context: ItemContext, legalMoves: MaterialMove[]) {
    const isRegionMove = isMoveItemType(MaterialType.Region)
    const mine = legalMoves.filter((m) => isRegionMove(m) && m.itemIndex === context.index)
    if (mine.length === 0) return null

    const takeMove = mine.find((m) => isRegionMove(m) && m.location.type === LocationType.PlayerRegionHand)
    const placeMove = mine.find((m) => isRegionMove(m) && m.location.type === LocationType.PlayerRegionLine)
    // "discard" covers both RegionDiscard (gameplay) and RegionDeck (put the card back in the deck during initial hand selection).
    const discardMove = mine.find((m) =>
      isRegionMove(m)
      && (m.location.type === LocationType.RegionDiscard || m.location.type === LocationType.RegionDeck)
    )

    const buttons: Array<{ icon: IconDefinition; move: MaterialMove; titleKey: string }> = []
    if (takeMove) buttons.push({ icon: HandIcon, move: takeMove, titleKey: 'button.pick' })
    if (placeMove) buttons.push({ icon: faArrowUp, move: placeMove, titleKey: 'button.place' })
    if (discardMove) buttons.push({ icon: TrashIcon, move: discardMove, titleKey: 'button.discard' })

    // Region-line cards: stack buttons in the bottom-left corner, slightly overflowing the bottom edge.
    if (item.location.type === LocationType.Region) {
      const halfW = this.width / 2
      const halfH = this.height / 2
      const buttonHalf = 1 // 2em button → 1em half-size
      const gap = 0.4
      const baseX = -halfW + buttonHalf + 0.3 // small inset from the left edge (no left overflow)
      const baseY = halfH + 0.3               // slight bottom overflow — most of button still visible below card
      return (
        <>
          {buttons.map((b, i) => (
            <FarawayMenuButton
              key={i}
              x={baseX + i * (2 + gap)}
              y={baseY}
              icon={b.icon}
              titleKey={b.titleKey}
              move={b.move}
            />
          ))}
        </>
      )
    }

    const spread = 25 // deg between buttons — tune for tighter/wider fan
    return (
      <>
        {buttons.map((b, i) => {
          // fan centered on 0° → buttons sit at the top of the card
          const angle = (i - (buttons.length - 1) / 2) * spread
          return (
            <FarawayMenuButton
              key={i}
              angle={angle}
              radius={4.2}
              icon={b.icon}
              titleKey={b.titleKey}
              move={b.move}
            />
          )
        })}
      </>
    )
  }

  help = RegionCardHelp
}

/** True when this region card is the one currently being resolved by ScoringRule
 *  (or its SacrificeSanctuary sub-rule). Exposed so the OverviewMode can paint the
 *  exact same highlight on its mini-cards. */
export const isCurrentlyResolvingRegion = (item: MaterialItem, context: MaterialContext): boolean => {
  if (item.location.type !== LocationType.PlayerRegionLine) return false
  const x = context.rules.remind(Memory.CurrentScoringX)
  if (x === undefined) return false
  return item.location.x === x
}

/**
 * True when this region card should display its score bubble.
 *  - During scoring: cards at x >= currentScoringX (the current one is included so the
 *    on-card bubble pops in sync with the panel's ScoringIndicator). The bubble itself
 *    holds back rendering while the reveal rotation is still animating.
 *  - Outside scoring: only when the game is over (memory was forgotten on the last tick).
 */
export const isResolvedRegion = (item: MaterialItem, context: MaterialContext): boolean => {
  if (item.location.type !== LocationType.PlayerRegionLine || item.location.x === undefined) return false
  const x = context.rules.remind(Memory.CurrentScoringX)
  if (typeof x === 'number') return item.location.x >= x
  return context.rules.isOver()
}

// Glow is rendered on a ::before pseudo so it doesn't squat the `animation` CSS
// property of the card element — otherwise it would collide with the framework's
// rotation/elevation animations and cancel the reveal flip (only the very first
// scoring card, where the glow class lands at the exact moment the rotation
// animation starts).
export const currentlyResolvingCss = css`
  position: relative;
  border-radius: 0.5em;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    animation: ${keyframes`
      0%, 100% { box-shadow: 0 0 0.6em 0.15em rgba(238, 184, 58, 0.55), 0 0 1.2em 0.4em rgba(238, 184, 58, 0.3); }
      50%      { box-shadow: 0 0 1.1em 0.4em rgba(238, 184, 58, 0.95), 0 0 2em 0.8em rgba(238, 184, 58, 0.5); }
    `} 1.4s ease-in-out infinite;
  }
`

export const regionCardDescription = new RegionCardDescription()