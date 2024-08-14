import { getRelativePlayerIndex, MaterialContext } from '@gamepark/react-game'
import { Coordinates } from '@gamepark/rules-api'

export const getPlayerBoardPosition = (context: MaterialContext, player?: number): Partial<Coordinates> => {
  const index = getPlayerIndex(context, player)
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
      return { y: 0, x: 55 }
  }

  return {}
}


export const getPlayerIndex = (context: MaterialContext, player?: number) => {
  switch (context.rules.players.length) {
    case 4:
      return [0, 1, 2, 5][getRelativePlayerIndex(context, player)]
    default:
      return getRelativePlayerIndex(context, player)
  }
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