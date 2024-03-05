import { Quest } from './Quest'

export class BrutPointQuest extends Quest {

  getScore(): number | undefined {
    return this.points
  }
}