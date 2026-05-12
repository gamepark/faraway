export enum Memory {
  Round = 1,
  /**
   * Position currently being resolved by ScoringRule, which iterates from x=7 down to x=0.
   * Initialized to 7 on the first tick, decremented after each tick. When it reaches -1,
   * the game ends. The sacrifice step (SacrificeSanctuaryRule) reads this to scope its
   * choices to "the SacrificeQuest at THIS x".
   */
  CurrentScoringX,
  /**
   * Per-x record of how many sanctuaries each player sacrificed during that scoring tick.
   * Shape: `Record<x, Record<PlayerId, number>>`. Written by SacrificeSanctuaryRule when
   * a player ends their sacrifice turn. SacrificeQuest.getTotalScore reads it to decide
   * whether the cost was paid for the card sitting at that x.
   */
  SacrificesByX,
  /**
   * Ephemeral baseline used by SacrificeSanctuaryRule: the size of each active player's
   * sanctuary line at rule entry, so that on endPlayerTurn we know how many sanctuaries
   * they sacrificed during this tick (initial − current). Cleared when the rule ends.
   */
  SacrificeBaseline
}
