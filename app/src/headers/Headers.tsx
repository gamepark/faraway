/** @jsxImportSource @emotion/react */
import { RuleId } from '@gamepark/faraway/rules/RuleId'
import { ComponentType } from 'react'
import { ChooseHandCardsHeader } from './ChooseHandCardsHeader'
import { DealSanctuariesHeader } from './DealSanctuariesHeader'
import { ExplorationHeader } from './ExplorationHeader'
import { NewRegionHeader } from './NewRegionHeader'
import { RefillHeader } from './RefillHeader'
import { RevealHeader } from './RevealHeader'
import { SanctuaryHeader } from './SanctuaryHeader'
import { ScoringHeader } from './ScoringHeader'

export const Headers: Partial<Record<RuleId, ComponentType>> = {
  [RuleId.PlaceRegion]: ExplorationHeader,
  [RuleId.RevealRegions]: RevealHeader,
  [RuleId.DealSanctuaries]: DealSanctuariesHeader,
  [RuleId.ChooseNewRegion]: NewRegionHeader,
  [RuleId.PlaceSanctuary]: SanctuaryHeader,
  [RuleId.RefillRegion]: RefillHeader,
  [RuleId.Scoring]: ScoringHeader,
  [RuleId.HideRegionLine]: ScoringHeader,
  [RuleId.ChooseHandCards]: ChooseHandCardsHeader
}