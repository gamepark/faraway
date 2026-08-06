import { FarawayOptionsSpecV2 } from '@gamepark/faraway/FarawayOptions'
import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { FarawaySetup } from '@gamepark/faraway/FarawaySetup'
import { GameProvider } from '@gamepark/react-game'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { farawayAnimations } from './animation/FarawayAnimations'
import App from './App'
import { Locators } from './locators/Locators'
import { FarawayLogs } from './logs/FarawayLogs'
import { Material } from './material/Material'
import { FarawayScoring } from './scoring/FarawayScoring'
import { theme } from './theme'
import { Tutorial } from './tutorial/Tutorial'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameProvider
      game="faraway"
      Rules={FarawayRules}
      optionsSpec={FarawayOptionsSpecV2}
      GameSetup={FarawaySetup}
      material={Material}
      locators={Locators}
      animations={farawayAnimations}
      tutorial={new Tutorial()}
      scoring={new FarawayScoring()}
      logs={new FarawayLogs()}
      theme={theme}
    >
      <App />
    </GameProvider>
  </StrictMode>
)
