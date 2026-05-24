/** @jsxImportSource @emotion/react */
import { FC } from 'react'
import { Trans } from 'react-i18next'

/** System-line log marking the start of the final scoring phase.
 *
 *  Emitted only on the first re-entry into the Scoring rule (when
 *  CurrentScoringX is still undefined / about to be set to 7). The
 *  Scoring rule self-loops via startRule(Scoring) once per x; we don't
 *  want a "scoring begins" line at every tick, only the first one —
 *  this is handled in the dispatcher (FarawayLogs.tsx).
 */
export const ScoringStartLog: FC = () => (
  <Trans i18nKey="log.scoring.start"/>
)
