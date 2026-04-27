import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { PlayerId } from '@gamepark/faraway/PlayerId'
import { MaterialContext } from '@gamepark/react-game'

export function getViewPlayer(context: MaterialContext<PlayerId, MaterialType, LocationType>): PlayerId | undefined {
  return (context.rules as unknown as { game: { view?: PlayerId } }).game.view ?? context.player ?? context.rules.players[0]
}
