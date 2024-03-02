import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { MaterialDescription } from '@gamepark/react-game'
import { regionCardDescription } from './RegionCardDescription'
import { sanctuaryCardDescription } from './SanctuaryCardDescription'

export const Material: Partial<Record<MaterialType, MaterialDescription>> = {
  [MaterialType.SanctuaryCard]: sanctuaryCardDescription,
  [MaterialType.RegionCard]: regionCardDescription
}
