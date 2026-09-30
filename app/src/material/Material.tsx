import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { MaterialDescription } from '@gamepark/react-game'
import { regionCardDescription } from './RegionCardDescription'
import { sanctuaryCardDescription } from './SanctuaryCardDescription'
import { scoreSheetDescription } from './ScoreSheetDescription'
import { spiritCardDescription } from './SpiritCardDescription'

export const Material: Partial<Record<MaterialType, MaterialDescription>> = {
  [MaterialType.Sanctuary]: sanctuaryCardDescription,
  [MaterialType.Region]: regionCardDescription,
  [MaterialType.ScoreSheet]: scoreSheetDescription,
  [MaterialType.Spirit]: spiritCardDescription
}
