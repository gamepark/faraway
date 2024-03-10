/** @jsxImportSource @emotion/react */
import { FarawayOptionsSpec } from '@gamepark/faraway/FarawayOptions'
import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { FarawaySetup } from '@gamepark/faraway/FarawaySetup'
import { GameProvider, setupTranslation } from '@gamepark/react-game'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { farawayAnimations } from './animation/FarawayAnimations'
import App from './App'
import { Locators } from './locators/Locators'
import { Material } from './material/Material'
import translations from './translations.json'
import { Tutorial } from './tutorial/Tutorial'

setupTranslation(translations, { debug: false })

ReactDOM.render(
  <StrictMode>
    <GameProvider
      game="faraway"
      Rules={FarawayRules}
      optionsSpec={FarawayOptionsSpec}
      GameSetup={FarawaySetup}
      material={Material}
      locators={Locators}
      animations={farawayAnimations}
      tutorial={new Tutorial()}
    >
      <App/>
    </GameProvider>
  </StrictMode>,
  document.getElementById('root')
)
