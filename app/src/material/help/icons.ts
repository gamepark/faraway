import { Color } from '@gamepark/faraway/cards/Color'
import { Wonder } from '@gamepark/faraway/cards/Wonder'
import chimera from '../../images/icon/chimera.png'
import autumn from '../../images/icon/City.jpg'
import clueIconImg from '../../images/icon/clue.png'
import winter from '../../images/icon/Desert.jpg'
import summer from '../../images/icon/Forest.jpg'
import MysticHeaven from '../../images/icon/MysticHeaven.jpg'
import spring from '../../images/icon/River.jpg'
import rock from '../../images/icon/rock.png'
import thistle from '../../images/icon/thistle.png'
import nightIconImg from '../../images/time/night.png'

export const wonderIcon: Record<Wonder, string> = {
  [Wonder.Rock]: rock,
  [Wonder.Chimera]: chimera,
  [Wonder.Thistle]: thistle
}

export const biomeIcon: Record<Color, string> = {
  [Color.Red]: summer,
  [Color.Green]: spring,
  [Color.Blue]: winter,
  [Color.Yellow]: autumn,
  [Color.Gray]: MysticHeaven
}

export const clueIcon = clueIconImg
export const nightIcon = nightIconImg
