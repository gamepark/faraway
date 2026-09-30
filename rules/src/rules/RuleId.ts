export enum RuleId {
  PlaceRegion = 1,
  RevealRegions,
  DealSanctuaries,
  ChooseNewRegion,
  PlaceSanctuary,
  RefillRegion,
  HideRegionLine,
  Scoring,
  ChooseHandCards,
  /**
   * Starry Skies extension: between HideRegionLine and Scoring, players who hold a
   * SacrificeQuest region card (BlueSky15, RedSky21, YellowSky38) may discard sanctuaries
   * to score the card's points. Discarded sanctuaries no longer count for other quests.
   */
  SacrificeSanctuary,
  /**
   * Beyond the Veil extension: after choosing a Region card (and a Sanctuary), the player
   * may take one of the available Spirits if they satisfy its acquisition conditions.
   */
  ChooseSpirit
}
