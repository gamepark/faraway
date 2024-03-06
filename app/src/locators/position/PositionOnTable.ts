import { PlayerId } from '@gamepark/faraway/PlayerId'
import { Coordinates, Location, MaterialRules } from '@gamepark/rules-api'

export const getDeltaForPosition = (location: Location, rules: MaterialRules, player?: PlayerId): Partial<Coordinates> => {
  const index = getBoardIndex(location, rules, player)
  switch (index) {
    case 1:
      return { y: -26 }
    case 2:
      return { y: -26, x: 55 }
    case 3:
      return { y: -26, x: 110 }
    case 4:
      return { x: 110 }
    case 5:
      return { y: 0, x: 55}
  }

  return {}
}


export const getBoardIndex = (location: Partial<Location>, rules: MaterialRules, player?: PlayerId) => {
  switch (rules.players.length) {
    case 4:
      return [0,1,2,5][computeBoardIndex(location, rules, player)]
    default:
      return computeBoardIndex(location, rules, player)
  }
}


export const computeBoardIndex = (location: Partial<Location>, rules: MaterialRules, player?: PlayerId) => {
  if (!player) return rules.players.indexOf(location.player!)
  if (player && player === location.player) return 0
  const remainingPlayers = rules.players.filter((p) => p !== player)
  if (remainingPlayers.length === 1) return 1
  return remainingPlayers.indexOf(location.player!) + 1
}

export const getTableSize = (players: number): { xMin: number, xMax: number, yMin: number, yMax: number } => {
  switch (players) {
    case 3:
      return { xMin: -27, xMax: 86, yMin: -24, yMax: 39 }
    case 4:
      return { xMin: -27, xMax: 86, yMin: -24, yMax: 39 }
    case 5:
      return { xMin: -27, xMax: 140, yMin: -33, yMax: 39 }
    case 6:
      return { xMin: -27, xMax: 140, yMin: -33, yMax: 39 }
    default:
      // 2 players
      return { xMin: -27, xMax: 53, yMin: -24, yMax: 35 }
  }
}