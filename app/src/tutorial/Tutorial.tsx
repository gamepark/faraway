/** @jsxImportSource @emotion/react */
import { Card } from '@gamepark/gold-n-crash/material/Card'
import { Flag } from '@gamepark/gold-n-crash/material/Flag'
import { LocationType } from '@gamepark/gold-n-crash/material/LocationType'
import { MaterialType } from '@gamepark/gold-n-crash/material/MaterialType'
import { RuleId } from '@gamepark/gold-n-crash/rules/RuleId'
import { MaterialTutorial, TutorialStep } from '@gamepark/react-game'
import { isMoveItemType, isStartRule } from '@gamepark/rules-api'
import { Trans } from 'react-i18next'
import { TutorialSetup } from './TutorialSetup'

const me = Flag.Chamourai
const opponent = Flag.Poulpirate

export class Tutorial extends MaterialTutorial<Flag, MaterialType, LocationType> {
  version = 3
  options = { players: [{ id: me }, { id: opponent }] }
  setup = new TutorialSetup()

  players = [{ id: me }, { id: opponent }]

  steps: TutorialStep[] = [
    {
      popup: {
        text: () => <Trans defaults="tuto.welcome"><strong/></Trans>
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.goal.1"><strong/></Trans>
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.goal.2"><strong/></Trans>
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.you"><strong/></Trans>,
        position: { x: 0, y: 27 }
      },
      focus: () => ({
        staticItems: [{ type: MaterialType.FlagCard, item: { id: Flag.Chamourai, location: { type: LocationType.Flag } } }],
        margin: { bottom: 5 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.deck"><strong/></Trans>,
        position: { x: 14.5, y: 5 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.Card)
          .player(me)
          .location(LocationType.CrewDeck)
          .sort((item) => -item.location.x!)
          .limit(20)],
        margin: { right: 20 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.discard"><strong/></Trans>,
        position: { x: 0, y: 33 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.Card)
            .player(me)
            .location(LocationType.Discard)
            .limit(10)
        ],
        margin: { bottom: 5 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.hand"><strong/></Trans>,
        position: { x: 0, y: 28 }
      },
      focus: (game) => ({
        materials: [this.material(game, MaterialType.Card)
          .player(me)
          .location(LocationType.Hand)],
        margin: { bottom: 5 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.zeppelin"><strong/></Trans>,
        position: { x: 0, y: 22 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.ZeppelinCard)
            .player(me)
            .location(LocationType.Zeppelins)
        ],
        margin: { left: 5, right: 5, bottom: 7 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.actions"><strong/></Trans>
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.draw"><strong/></Trans>,
        position: { x: 15, y: -15 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.Card)
            .player(me)
            .location(LocationType.CrewDeck)
            .sort((item) => -item.location.x!)
            .limit(1)
        ],
        locations: [this.location(LocationType.Hand).player(me).location],
        margin: { left: 5, top: 1, bottom: 1 }
      }),
      move: {
        player: me,
        filter: (move, game) => isMoveItemType(MaterialType.Card)(move)
          && move.location.type === LocationType.Hand
          && game.items[MaterialType.Card]![move.itemIndex].location.type === LocationType.CrewDeck
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.place"><strong/></Trans>,
        position: { x: -25, y: 30 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.Card)
            .player(me)
            .location(LocationType.Hand)
            .id((id: any) => id.front === Card.ChamouraiGreenCrew3)
            .limit(1)
        ],
        locations: [this.location(LocationType.Column).id(1).player(me).location],
        margin: { top: 1 }
      }),
      move: {
        player: me,
        filter: (move, game) => isMoveItemType(MaterialType.Card)(move)
          && move.location.type === LocationType.Column
          && move.location.id === 1
          && game.items[MaterialType.Card]![move.itemIndex].location.type === LocationType.Hand && game.items[MaterialType.Card]![move.itemIndex].id.front === Card.ChamouraiGreenCrew3
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.effect"><strong/></Trans>,
        position: { x: 0, y: 35 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.Card)
            .player(me)
            .location(LocationType.Column)
            .locationId(1),
          this.material(game, MaterialType.Card)
            .player(me)
            .location(LocationType.Hand)
            .maxBy((item) => item.location.x!)
        ],
        margin: { bottom: 6 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.opponent.1"><strong/></Trans>
      }
    },
    {
      move: {
        player: opponent,
        filter: (move, game) => {
          return isMoveItemType(MaterialType.Card)(move)
            && move.location.type === LocationType.Column
            && move.location.id === 3
            && game.items[MaterialType.Card]![move.itemIndex].id.front === Card.PoulpirateGold4
        }
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.opponent.action.1"><strong/></Trans>,
        position: { x: 0, y: 30 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.Card)
            .player(opponent)
            .location(LocationType.Column)
            .locationId(3)
        ],
        margin: { bottom: 7 }
      })
    },
    {
      move: {
        player: opponent,
        filter: (move, game) => {
          return isMoveItemType(MaterialType.Card)(move)
            && move.location.type === LocationType.Column
            && move.location.id === 2
            && game.items[MaterialType.Card]![move.itemIndex].id.front === Card.PoulpirateBrownCrew3
        }
      },
      focus: (game) => this.steps[game.tutorialStep! - 1].focus!(game)
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.opponent.action.2"><strong/></Trans>,
        position: { x: 0, y: 30 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.Card)
            .player(opponent)
            .location(LocationType.Column)
            .locationId(2)
        ],
        margin: { bottom: 7 }
      })
    },
    {
      move: {
        player: opponent,
        filter: (move, game) => {
          return isMoveItemType(MaterialType.Card)(move)
            && game.items[MaterialType.Card]![move.itemIndex].location.type === LocationType.Column
            && game.items[MaterialType.Card]![move.itemIndex].location.id === 3
            && game.items[MaterialType.Card]![move.itemIndex].id.front === Card.PoulpirateGold4
        }
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.opponent.treasure"><strong/></Trans>,
        position: { x: 0, y: 27 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.Card)
            .player(opponent)
            .location(LocationType.Treasure)
        ],
        margin: { bottom: 8 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.column.rule"><strong/></Trans>,
        position: { x: -25, y: 35 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.Card)
            .player(me)
            .location(LocationType.Hand)
            .id((id: any) => id.front === Card.ChamouraiRedCrew1)
        ],
        locations: [this.location(LocationType.Column).player(me).id(2).location],
        margin: { left: 2, right: 2, top: 1 }
      }),
      move: {
        player: me,
        filter: (move, game) => {
          return isMoveItemType(MaterialType.Card)(move)
            && move.location.type === LocationType.Column
            && move.location.id === 2
            && game.items[MaterialType.Card]![move.itemIndex].id.front === Card.ChamouraiRedCrew1
        },
        interrupt: (move) => isStartRule(move) && move.id === RuleId.Bombing
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.bombard"><strong/></Trans>,
        position: { x: 0, y: 5 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.ZeppelinCard).player(opponent).locationId(2),
          this.material(game, MaterialType.Card).player(me).location(LocationType.Column).locationId(2)
        ],
        margin: { top: 1, bottom: 1 }
      }),
      move: {}
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.zeppelin.value"><strong/></Trans>,
        position: { x: 0, y: 20 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.ZeppelinCard)
            .player(opponent)
            .location(LocationType.Zeppelins)
            .locationId(2)
        ],
        margin: { top: 1, bottom: 10 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.zeppelin.destroy"><strong/></Trans>,
        position: { x: 0, y: 20 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.ZeppelinCard)
            .player(opponent)
            .location(LocationType.Zeppelins)
            .locationId(2)
        ],
        margin: { top: 1, bottom: 10 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.purple"><strong/></Trans>,
        position: { x: -10, y: 30 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.Card)
            .player(me)
            .location(LocationType.Hand)
            .id((id: any) => id.front === Card.ChamouraiPurpleCrew1)
        ],
        locations: [this.location(LocationType.Column).player(me).id(3).location],
        margin: { left: 1, right: 3 }
      }),
      move: {
        player: me,
        filter: (move, game) => {
          return isMoveItemType(MaterialType.Card)(move)
            && move.location.type === LocationType.Column
            && move.location.id === 3
            && game.items[MaterialType.Card]![move.itemIndex].id.front === Card.ChamouraiPurpleCrew1
        }
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.discard.get"><strong/></Trans>
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.Card)
            .player(me)
            .location(LocationType.Column)
            .id((id: any) => id.front === Card.ChamouraiPurpleCrew1),
          this.material(game, MaterialType.Card)
            .player(me)
            .location(LocationType.Hand)
            .maxBy((item) => item.location.x!)
        ],
        margin: { left: 3, right: 3 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.opponent.2"><strong/></Trans>
      }
    },
    {
      move: {
        player: opponent,
        filter: (move, game) => {
          return isMoveItemType(MaterialType.Card)(move)
            && move.location.type === LocationType.Hand
            && game.items[MaterialType.Card]![move.itemIndex].location.type === LocationType.CrewDeck
        }
      }
    },
    {
      move: {
        player: opponent,
        filter: (move, game) => {
          return isMoveItemType(MaterialType.Card)(move)
            && move.location.type === LocationType.Hand
            && game.items[MaterialType.Card]![move.itemIndex].location.type === LocationType.CrewDeck
        }
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.opponent.draw"><strong/></Trans>
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.green"><strong/></Trans>,
        position: { x: -10, y: 30 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.Card)
            .player(me)
            .location(LocationType.Hand)
            .id((id: any) => id.front === Card.ChamouraiGreenCrew2)
        ],
        locations: [this.location(LocationType.Column).player(me).id(1).location],
        margin: { left: 3, right: 3 }
      }),
      move: {
        player: me,
        filter: (move, game) => {
          return isMoveItemType(MaterialType.Card)(move)
            && move.location.type === LocationType.Column
            && move.location.id === 1
            && game.items[MaterialType.Card]![move.itemIndex].location.type === LocationType.Hand
            && game.items[MaterialType.Card]![move.itemIndex].id.front === Card.ChamouraiGreenCrew2
        }
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.draw.2"><strong/></Trans>
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.discard.3"><strong/></Trans>
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.guest"><strong/></Trans>
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.guest.condition"><strong/></Trans>
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.Card)
            .location(LocationType.PrestigiousGuests)
        ]
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.guest.secure"><strong/></Trans>,
        position: { x: 15, y: 0 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.Card)
            .location(LocationType.PrestigiousGuests)
            .id((id: any) => id.front === Card.PrestigiousGuest3)
        ],
        margin: { right: 18 }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.guest.treasure"><strong/></Trans>
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.Card)
            .location(LocationType.PrestigiousGuests)
        ]
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.guest.lost"><strong/></Trans>
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.Card)
            .location(LocationType.PrestigiousGuests)
        ]
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.end.condition"><strong/></Trans>
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.click"><strong/></Trans>
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.go"><strong/></Trans>
      }
    }
  ]
}
