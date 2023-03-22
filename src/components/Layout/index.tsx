import { CssBaseline, ThemeProvider } from '@mui/material'
import Box from '@mui/material/Box'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

import Header from 'components/Header/Header'
import { languages } from 'config/i18n'
import { getThemeByName, themeKeys } from 'libs/ui/theme'

const Layout = () => {
  const [modeIdx, setModeIdx] = React.useState(0)
  const [langIdx, setLangIdx] = React.useState(0)
  const { i18n } = useTranslation()

  const onChangeLanguage = (index: number) => {
    setLangIdx(index)
    i18n.changeLanguage(languages[index])
  }

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: (index: number) => {
        setModeIdx(index)
      },
    }),
    [],
  )

  const theme = React.useMemo(
    () => getThemeByName(themeKeys[modeIdx]),
    [modeIdx],
  )

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header
          currentThemeIdx={modeIdx}
          currentLangIdx={langIdx}
          onChangeThemeClick={colorMode.toggleColorMode}
          onChangeLanguageClick={onChangeLanguage}
        />
        <main>
          <Box
            sx={{
              bgcolor: 'background.paper',
              pt: 3,
              pb: 3,
            }}
          >
            <Outlet />
          </Box>
        </main>
      </ThemeProvider>
    </>
  )
}

export default Layout
