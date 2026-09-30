export enum LocationType {
  PlayerRegionHand = 1,
  PlayerSanctuaryLine,
  RegionDeck,
  SanctuaryDeck,
  PlayerSanctuaryHand,
  PlayerRegionLine,
  Region,
  RegionDiscard,
  RegionScorePoints,
  SanctuaryScorePoints,
  CardCharacteristics,
  ScoreSheet,
  ScoreSheetBox,
  /** Beyond the Veil: face-up draw deck. Only the top card is revealed (rotation: true). */
  SpiritDeck,
  /** Beyond the Veil: the 2 Spirits players can take (x = 0 or 1) */
  AvailableSpirit,
  /** Beyond the Veil: Spirit placed under a Region card: parent = region index, x = x of the region in the line */
  PlayerSpirit,
  /** Beyond the Veil: score bubble displayed on a Spirit card (UI only) */
  SpiritScorePoints,
}
