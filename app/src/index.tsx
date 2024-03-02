/** @jsxImportSource @emotion/react */
import { FarawayOptionsSpec } from '@gamepark/faraway/FarawayOptions'
import { FarawayRules } from '@gamepark/faraway/FarawayRules'
import { FarawaySetup } from '@gamepark/faraway/FarawaySetup'
import { GameProvider, MaterialGameAnimations, setupTranslation } from '@gamepark/react-game'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Locators } from './locators/Locators'
import { Material } from './material/Material'
import translations from './translations.json'

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
      animations={new MaterialGameAnimations()}
    >
      <App/>
    </GameProvider>
  </StrictMode>,
  document.getElementById('root')
)
