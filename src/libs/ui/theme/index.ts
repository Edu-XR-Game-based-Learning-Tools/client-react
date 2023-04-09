import { Theme } from '@mui/material/styles'

import dark from './dark'
import darkChartreuse from './darkChartreuse'
import hackerNews from './hackerNews'
import jadeAndCoral from './jadeAndCoral'
import light from './light'

// primary?: PaletteColorOptions
// secondary?: PaletteColorOptions
// error?: PaletteColorOptions
// warning?: PaletteColorOptions
// info?: PaletteColorOptions
// success?: PaletteColorOptions
// mode?: PaletteMode
// tonalOffset?: PaletteTonalOffset
// contrastThreshold?: number
// common?: Partial<CommonColors>
// grey?: ColorPartial
// text?: Partial<TypeText>
// divider?: string
// action?: Partial<TypeAction>
// background?: Partial<TypeBackground>
// getContrastText?: (background: string) => string

// light: string,
// main: string,
// dark: string,
// contrastText: string

const themeMap: { [key: string]: Theme } = {
  jadeAndCoral,
  darkChartreuse,
  hackerNews,
  light,
  dark,
}

export const themeNames = ['Light', 'Dark', 'Jade And Coral', 'Dark Chartreuse', 'Hacker News']
export const themeKeys = ['light', 'dark', 'jadeAndCoral', 'darkChartreuse', 'hackerNews']

export function getThemeByName(theme: string): Theme {
  return themeMap[themeKeys.includes(theme) ? theme : themeKeys[0]]
}
