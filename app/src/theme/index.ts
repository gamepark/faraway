import { BottomBarNavigation, GameTheme } from '@gamepark/react-game'

// Faraway theme overrides. Deep-merged with `defaultTheme` by GameProvider,
// so only the keys that diverge from defaults need to be declared here.
export const theme: Partial<GameTheme> = {
  dialog: {
    backgroundColor: '#f0fbfc',
    color: '#002448',
    // Replaces the default left/right arrow help-dialog navigation with the
    // framework's bottom navigation bar (Previous/Next buttons + step dots).
    navigation: BottomBarNavigation
  }
}
