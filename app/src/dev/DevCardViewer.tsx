/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react'
import { Color } from '@gamepark/faraway/cards/Color'
import { Quest } from '@gamepark/faraway/cards/quests/Quest'
import { QuestType } from '@gamepark/faraway/cards/quests/QuestType'
import {
  expansion1Regions,
  getColor,
  getValue,
  Region,
  starrySkiesRegions
} from '@gamepark/faraway/cards/Region'
import { RegionQuests } from '@gamepark/faraway/cards/RegionQuests'
import { Sanctuary } from '@gamepark/faraway/cards/Sanctuary'
import { SanctuaryQuests } from '@gamepark/faraway/cards/SanctuaryQuests'
import { MaterialType } from '@gamepark/faraway/material/MaterialType'
import { DevToolEntry, MaterialComponent, Picture, usePlay } from '@gamepark/react-game'
import { MaterialMoveBuilder } from '@gamepark/rules-api'
import { FC, useCallback, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Trans, useTranslation } from 'react-i18next'
import { wonderIcon } from '../material/help/icons'
import { QuestHelp } from '../material/help/QuestHelp'

import displayMaterialHelp = MaterialMoveBuilder.displayMaterialHelp

const STORAGE_KEY = 'faraway-validated-effect-cards'

type ValidatedSet = { region: number[]; sanctuary: number[] }

const loadValidated = (): { region: Set<Region>; sanctuary: Set<Sanctuary> } => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { region: new Set(), sanctuary: new Set() }
    const parsed = JSON.parse(raw) as ValidatedSet
    return {
      region: new Set(parsed.region ?? []),
      sanctuary: new Set(parsed.sanctuary ?? [])
    }
  } catch {
    return { region: new Set(), sanctuary: new Set() }
  }
}

const saveValidated = (data: { region: Set<Region>; sanctuary: Set<Sanctuary> }) => {
  const payload: ValidatedSet = {
    region: [...data.region],
    sanctuary: [...data.sanctuary]
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

type Tab = 'region' | 'sanctuary'
type ExtensionFilter = 'all' | 'base' | 'expansion1' | 'starry-skies'
type ValidationFilter = 'all' | 'validated' | 'unvalidated'

const colorLabels: Record<Color, string> = {
  [Color.Red]: 'Red',
  [Color.Green]: 'Green',
  [Color.Blue]: 'Blue',
  [Color.Yellow]: 'Yellow',
  [Color.Gray]: 'Gray'
}

const colorAccents: Record<Color, string> = {
  [Color.Red]: '#c84a3a',
  [Color.Green]: '#3a8a52',
  [Color.Blue]: '#3a6ac8',
  [Color.Yellow]: '#d4a23a',
  [Color.Gray]: '#7a7a7a'
}

const questLabels: Record<QuestType, string> = {
  [QuestType.Clue]: 'Clue',
  [QuestType.Chimera]: 'Chimera',
  [QuestType.Rock]: 'Rock',
  [QuestType.Thistle]: 'Thistle',
  [QuestType.Color]: 'Color',
  [QuestType.AllColor]: 'All-Color',
  [QuestType.Night]: 'Night',
  [QuestType.BrutPoints]: 'Brut Points',
  [QuestType.WonderSet]: 'Wonder Set',
  [QuestType.RequireColor]: 'Require Color',
  [QuestType.RequireClue]: 'Require Clue',
  [QuestType.RequireNight]: 'Require Night',
  [QuestType.MultiWonderSum]: 'Multi-Wonder',
  [QuestType.Sacrifice]: 'Sacrifice'
}

const regionExtension = (r: Region): ExtensionFilter => {
  if (starrySkiesRegions.includes(r)) return 'starry-skies'
  if (expansion1Regions.includes(r)) return 'expansion1'
  return 'base'
}

const sanctuaryExtension = (s: Sanctuary): ExtensionFilter =>
  s >= 1000 ? 'expansion1' : 'base'

const sanctuaryColor = (s: Sanctuary): Color => {
  const hundreds = Math.floor((s % 1000) / 100)
  if (hundreds === 0) return Color.Red
  if (hundreds === 1) return Color.Green
  if (hundreds === 2) return Color.Blue
  if (hundreds === 3) return Color.Yellow
  return Color.Gray
}

export const DevCardViewer: FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <DevToolEntry
        icon={'✦'}
        label="Card Viewer"
        desc="Browse all effect cards"
        onClick={() => setIsOpen(true)}
      />
      {isOpen && <DevCardViewerOverlay onClose={() => setIsOpen(false)} />}
    </>
  )
}

const DevCardViewerOverlay: FC<{ onClose: () => void }> = ({ onClose }) => {
  const play = usePlay()
  const [tab, setTab] = useState<Tab>('region')
  const [extFilter, setExtFilter] = useState<ExtensionFilter>('all')
  const [colorFilter, setColorFilter] = useState<Color | 0>(0)
  const [questFilter, setQuestFilter] = useState<QuestType | -1>(-1)
  const [validationFilter, setValidationFilter] = useState<ValidationFilter>('all')
  const [search, setSearch] = useState('')
  const [cardScale, setCardScale] = useState(1)
  const [validated, setValidated] = useState(loadValidated)

  const regionEntries = useMemo(() => {
    return Object.entries(RegionQuests)
      .map(([id, quest]) => ({ id: Number(id) as Region, quest: quest as Quest }))
  }, [])

  const sanctuaryEntries = useMemo(() => {
    return Object.entries(SanctuaryQuests)
      .map(([id, quest]) => ({ id: Number(id) as Sanctuary, quest: quest as Quest }))
  }, [])

  const filteredRegions = useMemo(() => {
    return regionEntries
      .filter(({ id, quest }) => {
        if (extFilter !== 'all' && regionExtension(id) !== extFilter) return false
        if (colorFilter && getColor(id) !== colorFilter) return false
        if (questFilter !== -1 && quest.type !== questFilter) return false
        if (validationFilter === 'validated' && !validated.region.has(id)) return false
        if (validationFilter === 'unvalidated' && validated.region.has(id)) return false
        if (search && !String(getValue(id)).includes(search.trim())) return false
        return true
      })
      .sort((a, b) => a.id - b.id)
  }, [regionEntries, extFilter, colorFilter, questFilter, validationFilter, validated.region, search])

  const filteredSanctuaries = useMemo(() => {
    return sanctuaryEntries
      .filter(({ id, quest }) => {
        if (extFilter !== 'all' && sanctuaryExtension(id) !== extFilter) return false
        if (extFilter === 'starry-skies') return false
        if (colorFilter && sanctuaryColor(id) !== colorFilter) return false
        if (questFilter !== -1 && quest.type !== questFilter) return false
        if (validationFilter === 'validated' && !validated.sanctuary.has(id)) return false
        if (validationFilter === 'unvalidated' && validated.sanctuary.has(id)) return false
        if (search && !String(id).includes(search.trim())) return false
        return true
      })
      .sort((a, b) => a.id - b.id)
  }, [sanctuaryEntries, extFilter, colorFilter, questFilter, validationFilter, validated.sanctuary, search])

  const totalRegions = regionEntries.length
  const totalSanctuaries = sanctuaryEntries.length
  const validatedRegions = validated.region.size
  const validatedSanctuaries = validated.sanctuary.size

  const toggleRegion = useCallback((id: Region) => {
    setValidated(prev => {
      const next = { region: new Set(prev.region), sanctuary: new Set(prev.sanctuary) }
      if (next.region.has(id)) next.region.delete(id)
      else next.region.add(id)
      saveValidated(next)
      return next
    })
  }, [])

  const toggleSanctuary = useCallback((id: Sanctuary) => {
    setValidated(prev => {
      const next = { region: new Set(prev.region), sanctuary: new Set(prev.sanctuary) }
      if (next.sanctuary.has(id)) next.sanctuary.delete(id)
      else next.sanctuary.add(id)
      saveValidated(next)
      return next
    })
  }, [])

  const openRegionHelp = useCallback((id: Region) => {
    play(displayMaterialHelp(MaterialType.Region, { id }), { transient: true })
  }, [play])

  const openSanctuaryHelp = useCallback((id: Sanctuary) => {
    play(displayMaterialHelp(MaterialType.Sanctuary, { id }), { transient: true })
  }, [play])

  const resetFilters = useCallback(() => {
    setExtFilter('all')
    setColorFilter(0)
    setQuestFilter(-1)
    setValidationFilter('all')
    setSearch('')
  }, [])

  const resetValidation = useCallback(() => {
    if (!window.confirm('Reset all validated cards?')) return
    const empty = { region: new Set<Region>(), sanctuary: new Set<Sanctuary>() }
    saveValidated(empty)
    setValidated(empty)
  }, [])

  const root = document.getElementById('root')
  if (!root) return null

  const tabCount = tab === 'region' ? filteredRegions.length : filteredSanctuaries.length
  const tabTotal = tab === 'region' ? totalRegions : totalSanctuaries
  const tabValidated = tab === 'region' ? validatedRegions : validatedSanctuaries

  const isStarryDisabledForSanctuary = tab === 'sanctuary' && extFilter === 'starry-skies'

  // Region card on screen: 7em × 7em base. Sanctuary: 4.4em × 6.8em.
  // Scale via container font-size so MaterialComponent's em-based sizing follows.
  const baseFontSize = 28 * cardScale

  return createPortal(
    <div css={overlayCss}>
      <div css={headerCss}>
        <div css={headerTopCss}>
          <div css={titleBlockCss}>
            <span css={titleGlyphCss}>{'✦'}</span>
            <h2 css={titleTextCss}>Effect Cards</h2>
            <span css={counterChipCss}>
              {tabCount} / {tabTotal}
            </span>
            {tabValidated > 0 && (
              <span css={validatedChipCss}>{tabValidated} OK</span>
            )}
          </div>
          <div css={headerRightCss}>
            <label css={scaleLabelCss}>
              <span>{(cardScale * 100).toFixed(0)}%</span>
              <input
                type="range"
                min="0.3"
                max="2"
                step="0.1"
                value={cardScale}
                onChange={e => setCardScale(parseFloat(e.target.value))}
                css={rangeInputCss}
              />
            </label>
            <button css={closeXCss} onClick={onClose}>&times;</button>
          </div>
        </div>

        <div css={tabBarCss}>
          <button
            css={[tabBtnCss, tab === 'region' && tabBtnActiveCss]}
            onClick={() => setTab('region')}
          >
            Regions ({validatedRegions}/{totalRegions})
          </button>
          <button
            css={[tabBtnCss, tab === 'sanctuary' && tabBtnActiveCss]}
            onClick={() => setTab('sanctuary')}
          >
            Sanctuaries ({validatedSanctuaries}/{totalSanctuaries})
          </button>
        </div>

        <div css={filterBarCss}>
          <input
            type="text"
            placeholder="Search id..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            css={searchCss}
          />
          <select
            value={extFilter}
            onChange={e => setExtFilter(e.target.value as ExtensionFilter)}
            css={selectCss}
          >
            <option value="all">All sets</option>
            <option value="base">Base game</option>
            <option value="expansion1">Expansion 1</option>
            <option value="starry-skies" disabled={tab === 'sanctuary'}>
              Starry Skies
            </option>
          </select>
          <select
            value={colorFilter}
            onChange={e => setColorFilter(Number(e.target.value) as Color | 0)}
            css={selectCss}
          >
            <option value={0}>All colors</option>
            {Object.entries(colorLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select
            value={questFilter}
            onChange={e => setQuestFilter(Number(e.target.value) as QuestType | -1)}
            css={selectCss}
          >
            <option value={-1}>All quests</option>
            {Object.entries(questLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select
            value={validationFilter}
            onChange={e => setValidationFilter(e.target.value as ValidationFilter)}
            css={selectCss}
          >
            <option value="all">All</option>
            <option value="validated">Validated</option>
            <option value="unvalidated">Todo</option>
          </select>
          <button css={resetCss} onClick={resetFilters}>Reset filters</button>
          <button css={dangerCss} onClick={resetValidation}>Clear validation</button>
        </div>

        <div css={hintBarCss}>
          Click a card to open its full help. Right-click or use the button to mark as validated.
        </div>
      </div>

      {isStarryDisabledForSanctuary ? (
        <div css={emptyCss}>Starry Skies does not include sanctuary cards.</div>
      ) : (
        <div css={gridCss} style={{ fontSize: `${baseFontSize}px` }}>
          {tab === 'region' &&
            filteredRegions.map(({ id, quest }) => (
              <RegionTile
                key={id}
                id={id}
                quest={quest}
                isValidated={validated.region.has(id)}
                onClick={() => openRegionHelp(id)}
                onToggleValidate={() => toggleRegion(id)}
              />
            ))}
          {tab === 'sanctuary' &&
            filteredSanctuaries.map(({ id, quest }) => (
              <SanctuaryTile
                key={id}
                id={id}
                quest={quest}
                isValidated={validated.sanctuary.has(id)}
                onClick={() => openSanctuaryHelp(id)}
                onToggleValidate={() => toggleSanctuary(id)}
              />
            ))}
        </div>
      )}

      {!isStarryDisabledForSanctuary && tabCount === 0 && (
        <div css={emptyCss}>No cards match the current filters.</div>
      )}
    </div>,
    root
  )
}

const RegionTile: FC<{
  id: Region
  quest: Quest
  isValidated: boolean
  onClick: () => void
  onToggleValidate: () => void
}> = ({ id, quest, isValidated, onClick, onToggleValidate }) => {
  const color = getColor(id)
  const accent = colorAccents[color]
  const onContext = (e: React.MouseEvent) => {
    e.preventDefault()
    onToggleValidate()
  }
  return (
    <div
      css={[tileCss, isValidated && tileValidatedCss]}
      onContextMenu={onContext}
    >
      <div css={tileAccentCss} style={{ background: accent }} />
      <div css={tileBodyCss}>
        <div css={cardThumbCss} onClick={onClick}>
          <MaterialComponent type={MaterialType.Region} itemId={id} css={matCss} />
          {isValidated && (
            <div css={sealOverlayCss}>
              <div css={sealCss}>{'✓'}</div>
            </div>
          )}
        </div>
        <div css={infoPanelCss}>
          <div css={cardTitleCss} onClick={onClick}>
            <span css={cardIdCss}>#{id}</span>
            <span>Time {getValue(id)}</span>
          </div>
          <div css={tagRowCss}>
            <span css={tagCss} style={{ color: accent, borderColor: accent + '55' }}>
              {colorLabels[color]}
            </span>
            <span css={questTagCss}>{questLabels[quest.type]}</span>
            <span css={extTagCss}>{extensionLabel(regionExtension(id))}</span>
          </div>
          <div css={questTextCss}>
            <QuestLine quest={quest} />
          </div>
          <button
            css={[validateBtnCss, isValidated && validateBtnOkCss]}
            onClick={e => {
              e.stopPropagation()
              onToggleValidate()
            }}
          >
            {isValidated ? '✓ Validated' : 'Mark as OK'}
          </button>
        </div>
      </div>
    </div>
  )
}

const SanctuaryTile: FC<{
  id: Sanctuary
  quest: Quest
  isValidated: boolean
  onClick: () => void
  onToggleValidate: () => void
}> = ({ id, quest, isValidated, onClick, onToggleValidate }) => {
  const color = sanctuaryColor(id)
  const accent = colorAccents[color]
  const onContext = (e: React.MouseEvent) => {
    e.preventDefault()
    onToggleValidate()
  }
  return (
    <div
      css={[tileCss, isValidated && tileValidatedCss]}
      onContextMenu={onContext}
    >
      <div css={tileAccentCss} style={{ background: accent }} />
      <div css={tileBodyCss}>
        <div css={[cardThumbCss, sanctuaryThumbCss]} onClick={onClick}>
          <MaterialComponent type={MaterialType.Sanctuary} itemId={id} css={matCss} />
          {isValidated && (
            <div css={sealOverlayCss}>
              <div css={sealCss}>{'✓'}</div>
            </div>
          )}
        </div>
        <div css={infoPanelCss}>
          <div css={cardTitleCss} onClick={onClick}>
            <span css={cardIdCss}>#{id}</span>
            <span>Sanctuary</span>
          </div>
          <div css={tagRowCss}>
            <span css={tagCss} style={{ color: accent, borderColor: accent + '55' }}>
              {colorLabels[color]}
            </span>
            <span css={questTagCss}>{questLabels[quest.type]}</span>
            <span css={extTagCss}>{extensionLabel(sanctuaryExtension(id))}</span>
          </div>
          <div css={questTextCss}>
            <QuestLine quest={quest} />
          </div>
          <button
            css={[validateBtnCss, isValidated && validateBtnOkCss]}
            onClick={e => {
              e.stopPropagation()
              onToggleValidate()
            }}
          >
            {isValidated ? '✓ Validated' : 'Mark as OK'}
          </button>
        </div>
      </div>
    </div>
  )
}

const extensionLabel = (ext: ExtensionFilter): string => {
  switch (ext) {
    case 'base': return 'Base'
    case 'expansion1': return 'Exp 1'
    case 'starry-skies': return 'Sky'
    default: return ''
  }
}

// Mirrors the "Quête" line of RegionCardHelp / SanctuaryCardHelp: label,
// optional wonder prerequisite (with icons), and the QuestHelp text.
const QuestLine: FC<{ quest: Quest }> = ({ quest }) => {
  const { t } = useTranslation()
  return (
    <p css={questLineCss}>
      <strong>{t('help.quest')}</strong>
      {' '}
      {!!quest.wonders?.length && (
        <>
          <Trans
            i18nKey="help.quest.prerequisite"
            values={{ quantity: quest.wonders.length }}
          >
            <>
              {quest.wonders.map((wonder, index) => (
                <Picture key={index} src={wonderIcon[wonder]} />
              ))}
            </>
          </Trans>
          {' '}
        </>
      )}
      <QuestHelp quest={quest} />
    </p>
  )
}

// ── Styles ──────────────────────────────────────

const overlayCss = css`
  position: fixed;
  inset: 0;
  /* Above the GP menu / journal (max 1000) so framework buttons don't poke
     through, below the framework help Dialog (1100) so the help popup still
     overlays the viewer. */
  z-index: 1050;
  overflow-y: auto;
  overflow-x: hidden;
  background: #0c0e14;
  color: #e0dcc0;
  font-family: 'Mulish', sans-serif;
  padding-bottom: 4em;
`

const headerCss = css`
  position: sticky;
  top: 0;
  z-index: 10;
  padding: 14px 18px 10px;
  background: linear-gradient(180deg, #14202b 0%, #0c1219 100%);
  border-bottom: 2px solid rgba(40, 184, 206, 0.2);
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.4);
`

const headerTopCss = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`

const titleBlockCss = css`
  display: flex;
  align-items: center;
  gap: 10px;
`

const titleGlyphCss = css`
  color: #28b8ce;
  font-size: 22px;
`

const titleTextCss = css`
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #e0f0f4;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`

const counterChipCss = css`
  font-size: 13px;
  color: #6a8a98;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`

const validatedChipCss = css`
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 99px;
  background: rgba(5, 150, 105, 0.15);
  color: #34d399;
  font-weight: 700;
`

const headerRightCss = css`
  display: flex;
  align-items: center;
  gap: 14px;
`

const scaleLabelCss = css`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6a8a98;
  font-weight: 600;
`

const rangeInputCss = css`
  width: 90px;
  cursor: pointer;
  accent-color: #28b8ce;
`

const closeXCss = css`
  background: none;
  border: none;
  font-size: 28px;
  color: #6a8a98;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
  &:hover { color: #ef4444; }
`

const tabBarCss = css`
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
`

const tabBtnCss = css`
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 700;
  border-radius: 6px;
  border: 1px solid rgba(40, 184, 206, 0.2);
  background: rgba(40, 184, 206, 0.04);
  color: #9fc0c8;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  font-family: inherit;
  &:hover { border-color: rgba(40, 184, 206, 0.4); }
`

const tabBtnActiveCss = css`
  background: rgba(40, 184, 206, 0.18);
  border-color: rgba(40, 184, 206, 0.5);
  color: #e0f0f4;
`

const filterBarCss = css`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
`

const inputBase = css`
  padding: 6px 10px;
  font-size: 13px;
  border-radius: 5px;
  border: 1px solid rgba(40, 184, 206, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: #e0f0f4;
  font-family: inherit;
  &:focus {
    outline: none;
    border-color: #28b8ce;
    box-shadow: 0 0 0 2px rgba(40, 184, 206, 0.18);
  }
`

const searchCss = css`
  ${inputBase};
  width: 130px;
  &::placeholder { color: #6a8a98; }
`

const selectCss = css`
  ${inputBase};
  cursor: pointer;
  option { background: #14202b; color: #e0f0f4; }
`

const resetCss = css`
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 700;
  border-radius: 5px;
  border: 1px solid rgba(40, 184, 206, 0.3);
  background: rgba(40, 184, 206, 0.08);
  color: #9fe2f7;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-family: inherit;
  &:hover { background: rgba(40, 184, 206, 0.16); }
`

const dangerCss = css`
  ${resetCss};
  border-color: rgba(239, 68, 68, 0.4);
  background: rgba(239, 68, 68, 0.08);
  color: #fca5a5;
  &:hover { background: rgba(239, 68, 68, 0.18); }
`

const hintBarCss = css`
  margin-top: 6px;
  font-size: 11px;
  color: #5a8a98;
  letter-spacing: 0.02em;
`

const gridCss = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(28em, 1fr));
  gap: 1em;
  padding: 1.5em;
`

const tileCss = css`
  position: relative;
  border-radius: 10px;
  background: linear-gradient(160deg, #15202b 0%, #0f1820 100%);
  border: 1px solid rgba(40, 184, 206, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: border-color 0.2s, box-shadow 0.2s;
  &:hover {
    border-color: rgba(40, 184, 206, 0.5);
    box-shadow: 0 6px 22px rgba(0, 0, 0, 0.45);
    z-index: 2;
  }
`

const tileValidatedCss = css`
  border-color: rgba(52, 211, 153, 0.5);
  box-shadow: 0 0 0 2px rgba(52, 211, 153, 0.15), 0 2px 8px rgba(0, 0, 0, 0.3);
  &:hover {
    border-color: rgba(52, 211, 153, 0.7);
    box-shadow: 0 0 0 2px rgba(52, 211, 153, 0.2), 0 6px 22px rgba(0, 0, 0, 0.45);
  }
`

const tileAccentCss = css`
  height: 4px;
  width: 100%;
  border-radius: 10px 10px 0 0;
`

const tileBodyCss = css`
  display: flex;
  gap: 1em;
  padding: 1em;
`

const cardThumbCss = css`
  flex-shrink: 0;
  position: relative;
  width: 7em;
  height: 7em;
  cursor: pointer;
  border-radius: 0.5em;
  transition: transform 0.18s ease-out, box-shadow 0.18s ease-out;
  transform-origin: center center;
  &:hover {
    transform: scale(1.6);
    z-index: 5;
    box-shadow: 0 0.8em 2em rgba(0, 0, 0, 0.6);
  }
`

const sanctuaryThumbCss = css`
  width: 4.4em;
  height: 6.8em;
`

const matCss = css`
  width: 100% !important;
  height: 100% !important;
  position: relative !important;
  transform: none !important;
`

const sealPop = keyframes`
  0% { transform: scale(0) rotate(-20deg); opacity: 0; }
  60% { transform: scale(1.15) rotate(3deg); opacity: 1; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
`

const sealOverlayCss = css`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`

const sealCss = css`
  width: 2.4em;
  height: 2.4em;
  border-radius: 50%;
  border: 0.15em solid rgba(52, 211, 153, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4em;
  font-weight: 900;
  color: #fff;
  background: rgba(5, 150, 105, 0.6);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  animation: ${sealPop} 0.3s ease-out;
`

const infoPanelCss = css`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.45em;
  font-size: 0.875em;
`

const cardTitleCss = css`
  font-size: 1em;
  font-weight: 800;
  color: #e0f0f4;
  cursor: pointer;
  display: flex;
  align-items: baseline;
  gap: 0.5em;
  &:hover { color: #28b8ce; }
`

const cardIdCss = css`
  font-size: 0.7em;
  font-weight: 600;
  color: #5a8a98;
`

const tagRowCss = css`
  display: flex;
  flex-wrap: wrap;
  gap: 0.3em;
`

const tagCss = css`
  font-size: 0.7em;
  font-weight: 700;
  padding: 0.15em 0.6em;
  border-radius: 0.25em;
  border: 1px solid;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`

const questTagCss = css`
  font-size: 0.7em;
  font-weight: 700;
  padding: 0.15em 0.6em;
  border-radius: 0.25em;
  color: #28b8ce;
  border: 1px solid rgba(40, 184, 206, 0.4);
  background: rgba(40, 184, 206, 0.1);
`

const extTagCss = css`
  font-size: 0.65em;
  font-weight: 600;
  padding: 0.15em 0.55em;
  border-radius: 0.25em;
  color: #aab8c0;
  border: 1px solid rgba(170, 184, 192, 0.2);
  background: rgba(170, 184, 192, 0.05);
`

const questTextCss = css`
  font-size: 0.85em;
  line-height: 1.4;
  color: #c8d4d8;
  & em { color: #ffd380; font-style: normal; font-weight: 700; }
  & strong { color: #fff; }
  & p { margin: 0; }
`

const questLineCss = css`
  margin: 0;

  /* display: contents removes <picture> from layout so only <img> sets line
     metrics — picture can't end up taller than its child. */
  picture { display: contents; }

  /* Targeting <img> directly (not its inline parents like <em> or <strong>)
     keeps the vertical-align offset on the icon only — without it cascading
     up through wrappers (which would double-shift icons inside ResourceEm). */
  picture img,
  > img {
    vertical-align: middle;
    height: 1.3em;
    margin-right: 0.15em;
    transform: translateY(-0.1em);
  }
`

const validateBtnCss = css`
  margin-top: auto;
  padding: 0.4em 0.8em;
  font-size: 0.75em;
  font-weight: 700;
  border-radius: 0.3em;
  border: 1px solid rgba(40, 184, 206, 0.25);
  background: rgba(255, 255, 255, 0.03);
  color: #9fc0c8;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  align-self: flex-start;
  font-family: inherit;
  &:hover {
    background: rgba(52, 211, 153, 0.12);
    border-color: rgba(52, 211, 153, 0.4);
    color: #34d399;
  }
`

const validateBtnOkCss = css`
  background: rgba(52, 211, 153, 0.15);
  border-color: rgba(52, 211, 153, 0.5);
  color: #34d399;
  &:hover {
    background: rgba(239, 68, 68, 0.12);
    border-color: rgba(239, 68, 68, 0.4);
    color: #fca5a5;
  }
`

const emptyCss = css`
  text-align: center;
  padding: 4em 1em;
  color: #5a8a98;
  font-size: 0.95em;
  font-style: italic;
`
