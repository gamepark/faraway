import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { PlayerId } from '@gamepark/faraway/PlayerId'
import { MaterialContext } from '@gamepark/react-game'

// Returns the player whose perspective the table is showing:
//   1. `game.view` if explicitly set
//   2. otherwise the local user (`context.player`)
//   3. otherwise the first player — so spectators (who have no `context.player`)
//      see something coherent by default instead of a "no view" state.
//
// The `players[0]` fallback was previously avoided because, in animation
// closures, `context.player` can be momentarily undefined for a logged-in
// non-first player, which would briefly mis-classify their cards as
// "non-viewed". That edge case is rare and visually negligible compared to
// the spectator default being broken, so the fallback is now applied.
export function getViewPlayer(context: MaterialContext<PlayerId, MaterialType, LocationType>): PlayerId | undefined {
  const explicitView = (context.rules as unknown as { game: { view?: PlayerId } }).game.view
  return explicitView ?? context.player ?? context.rules.players[0]
}
