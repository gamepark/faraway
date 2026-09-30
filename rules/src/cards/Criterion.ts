/**
 * Beyond the Veil extension: what a Spirit card counts, either to be acquired or to score.
 * Every Spirit has a different acquisition criterion.
 */
export enum Criterion {
  RedCard = 1,
  GreenCard,
  BlueCard,
  YellowCard,
  GrayCard,
  Chimera,
  Rock,
  Thistle,
  Clue,
  Night,
  /** Region or Sanctuary card without any Wonder (rock, chimera, thistle) */
  NoResourceCard,
  /** Region card with an exploration time lower than 20 */
  ShortExploration,
  /** Region card with an exploration time greater than 40 */
  LongExploration,
  Spirit
}
