/** @jsxImportSource @emotion/react */
import { Region } from '@gamepark/faraway/cards/Region'
import { LocationType } from '@gamepark/faraway/material/LocationType'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { PlayerId } from '@gamepark/faraway/PlayerId'
import { MaterialTutorial, TutorialStep } from '@gamepark/react-game'
import { isEndPlayerTurn, isMoveItemType } from '@gamepark/rules-api'
import { Trans } from 'react-i18next'
import Clue from '../images/icon/clue.png'
import Rock from '../images/icon/rock.png'
import Day from '../images/time/day.png'
import Night from '../images/time/night.png'
import { Characteristic } from '../locators/CardCharacteristicLocator'
import { icon, radius, resource } from '../style'
import City from '../images/icon/City.jpg'
import Desert from '../images/icon/Desert.jpg'
import Forest from '../images/icon/Forest.jpg'
import River from '../images/icon/River.jpg'
import { TutorialSetup } from './TutorialSetup'

const me = 1
const opponent = 2

export class Tutorial extends MaterialTutorial<PlayerId, MaterialType, LocationType> {
  version = 5
  options = { players: 2 }
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
        text: () => <Trans defaults="tuto.goal"><strong/><i/></Trans>
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.region"><strong/><i/></Trans>,
        position: { x: 0, y: -7 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.Region).location(LocationType.PlayerRegionHand).player(me)
        ],
        locations: Array.from(Array(8)).map((_, x) => this.location(LocationType.PlayerRegionLine).player(me).x(x).location),
        margin: {
          top: 2,
          bottom: 2
        }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.place.region"><strong/><i/></Trans>,
        position: { y: 1, x: 0 }
      },
      focus: (game) =>
        ({
          materials: [
            this.material(game, MaterialType.Region).player(me).id(Region.Blue6)
          ],
          locations: [
            this.location(LocationType.PlayerRegionLine).player(me).x(0).location
          ],
          margin: {
            top: 2,
            bottom: 2
          }
        }),
      move: {
        player: me,
        filter: (move, game) => {
          const firstCard = this.material(game, MaterialType.Region).player(me).id(Region.Blue6)
          return isMoveItemType(MaterialType.Region)(move) && move.itemIndex === firstCard.getIndex()
        }
      }
    },
    {
      move: {
        player: opponent,
        filter: (move, game) => {
          const firstCard = this.material(game, MaterialType.Region).location(LocationType.PlayerRegionHand).id(Region.Green67).player(opponent)
          return isMoveItemType(MaterialType.Region)(move) && move.itemIndex === firstCard.getIndex()
        },
        interrupt: (move) => isEndPlayerTurn(move) && move.player === opponent
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.place.region.other"><strong/><i/></Trans>,
        position: { y: 0, x: 20 }
      },
      move: {}
    },
    {
      popup: {
        text: (t) => (
          <>
            <Trans defaults="tuto.biome"><strong/></Trans>
            <br/><span css={[icon(Forest), radius(20)]}/> {t('biome.1')}<br/>
            <br/><span css={[icon(River), radius(20)]}/> {t('biome.2')}<br/>
            <br/><span css={[icon(Desert), radius(20)]}/> {t('biome.3')}<br/>
            <br/><span css={[icon(City), radius(20)]}/> {t('biome.4')}<br/>
            <br/><Trans defaults="tuto.biome.quest"><strong/></Trans>
          </>
        ),
        position: { x: 30, y: 0 }
      },
      focus: (game) =>
        ({
          locations: [
            this
              .location(LocationType.CardCharacteristics)
              .id(Characteristic.Biome)
              .parent(this.material(game, MaterialType.Region).location((location) => location.type === LocationType.Region && location.x === 0).getIndex())
              .location
          ],
          margin: {
            right: 17,
            top: 3
          }
        })
    },
    {
      popup: {
        text: () => (
          <Trans defaults="tuto.hour">
            <strong/><i/>
            <span css={icon(Day)}/>
            <span css={icon(Night)}/>
          </Trans>
        ),
        position: { x: 30, y: 0 }
      },
      focus: (game) =>
        ({
          locations: [
            this
              .location(LocationType.CardCharacteristics)
              .id(Characteristic.Time)
              .parent(this.material(game, MaterialType.Region).location((location) => location.type === LocationType.Region && location.x === 0).getIndex())
              .location
          ],
          margin: {
            right: 17
          }
        })
    },
    {
      popup: {
        text: () => (
          <Trans defaults="tuto.region.draw">
            <strong/><i/>
          </Trans>
        ),
        position: { x: 0, y: -23 }
      },
      focus: (game) =>
        ({
          materials: [
            this.material(game, MaterialType.Region).location(LocationType.Region)
          ],
          margin: {
            top: 7.5
          }
        })
    },
    {
      popup: {
        text: () => (
          <Trans defaults="tuto.region.draw.me">
            <strong/><i/>
          </Trans>
        )
      },
      focus: (game) =>
        ({
          materials: [
            this.material(game, MaterialType.Region).location(LocationType.Region)
          ],
          locations: [
            this.location(LocationType.PlayerRegionHand).player(me).location
          ],
          margin: {
            top: 2,
            bottom: 2
          }
        }),
      move: {
        player: me
      }
    },
    {
      move: {
        player: opponent
      }
    },
    {
      popup: {
        text: () => (
          <Trans defaults="tuto.round">
            <strong/><i/>
          </Trans>
        ),
        position: { x: 0, y: -5 }
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.place.region"><strong/><i/></Trans>,
        position: { y: 1, x: 0 }
      },
      focus: (game) =>
        ({
          materials: [
            this.material(game, MaterialType.Region).player(me).id(Region.Blue21)
          ],
          locations: [
            this.location(LocationType.PlayerRegionLine).player(me).x(1).location
          ],
          margin: {
            top: 2,
            bottom: 2
          }
        }),
      move: {
        player: me,
        filter: (move, game) => {
          const firstCard = this.material(game, MaterialType.Region).player(me).id(Region.Blue21)
          return isMoveItemType(MaterialType.Region)(move) && move.itemIndex === firstCard.getIndex()
        }
      }
    },
    {
      move: {
        player: opponent,
        filter: (move, game) => {
          const firstCard = this.material(game, MaterialType.Region).location(LocationType.PlayerRegionHand).id(Region.Red52).player(opponent)
          return isMoveItemType(MaterialType.Region)(move) && move.itemIndex === firstCard.getIndex()
        },
        interrupt: (move) => isMoveItemType(MaterialType.Sanctuary)(move)
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.quest">
          <strong/>
          <i/>
          <span css={resource(Rock)}/>
        </Trans>,
        position: { y: 5, x: 30 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.Region).player(me).id(Region.Blue21)
        ],
        margin: {
          right: 17
        }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.scoring"><strong/><i/><span css={resource(Rock)}/></Trans>,
        position: { y: -17, x: 0 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.Region).player(me).id(Region.Blue21),
          this.material(game, MaterialType.Region).player(me).id(Region.Blue6)
        ],
        margin: {
          top: 9
        }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.sanctuary"><strong/><i/></Trans>,
        position: { y: -17, x: 0 }
      },
      focus: (game) =>
        ({
          materials: [
            this.material(game, MaterialType.Region).player(me).id(Region.Blue21),
            this.material(game, MaterialType.Region).player(me).id(Region.Blue6)
          ],
          locations: this
            .material(game, MaterialType.Region)
            .location(LocationType.PlayerRegionLine)
            .player(me)
            .getIndexes()
            .map((index) => (
              this
                .location(LocationType.CardCharacteristics)
                .id(Characteristic.Time)
                .parent(index)
                .location
            )),
          margin: {
            top: 9
          }
        })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.clue">
          <strong/>
          <i/>
          <span css={icon(Clue)}/>
        </Trans>,
        position: { y: -17, x: 0 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.Region).player(me).id(Region.Blue6)
        ],
        locations: [
          this
            .location(LocationType.CardCharacteristics)
            .id(Characteristic.Clue)
            .parent(this.material(game, MaterialType.Region).id(Region.Blue6).getIndex())
            .location
        ],
        margin: {
          top: 7
        }
      }),
      move: {}
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.sanctuary.drawn">
          <strong/>
          <i/>
          <span css={icon(Clue)}/>
        </Trans>,
        position: { y: -20, x: -5 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.Sanctuary).player(me).location(LocationType.PlayerSanctuaryHand)
        ],
        margin: {
          top: 7
        }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.region.draw.2">
          <strong/>
          <i/>
        </Trans>
      },
      focus: (game) =>
        ({
          materials: [
            this.material(game, MaterialType.Region).location(LocationType.Region)
          ],
          locations: [
            this.location(LocationType.PlayerRegionHand).player(me).location
          ],
          margin: {
            top: 2,
            bottom: 2
          }
        }),
      move: {
        player: me
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.sanctuary.choose">
          <strong/>
          <i/>
        </Trans>,
        position: { y: -20, x: -5 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.Sanctuary).player(me).location(LocationType.PlayerSanctuaryHand)
        ],
        margin: {
          top: 7
        }
      })
    },
    {
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.Sanctuary).player(me).location(LocationType.PlayerSanctuaryHand)
        ],
        locations: [
          this
            .location(LocationType.PlayerSanctuaryLine)
            .player(me)
            .location
        ],
        margin: {
          top: 2,
          bottom: 2
        }
      }),
      move: {
        player: me
      }
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.sanctuary.why">
          <strong/>
          <i/>
        </Trans>,
        position: { x: 25, y: 3.5 }
      },
      focus: (game) => ({
        materials: [
          this.material(game, MaterialType.Sanctuary).player(me).location(LocationType.PlayerSanctuaryLine)
        ],
        margin: {
          right: 15
        }
      })
    },
    {
      popup: {
        text: () => <Trans defaults="tuto.end">
          <strong/>
          <i/>
        </Trans>
      }
    }

  ]
}
