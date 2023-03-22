import { Grid, Link } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { NavLink as RouterLink } from 'react-router-dom'

import { languages } from 'config/i18n'
import Dropdown from 'libs/ui/components/Dropdown/Dropdown'
import { themeNames } from 'libs/ui/theme'

type HeaderProps = {
  currentThemeIdx: number
  currentLangIdx: number
  onChangeThemeClick: (idx: number) => void
  onChangeLanguageClick: (idx: number) => void
}

const Header = (props: HeaderProps) => {
  const { t } = useTranslation()

  const { currentThemeIdx, currentLangIdx, onChangeThemeClick, onChangeLanguageClick: onChangeLanguage } = props

  return (
    <>
      <AppBar
        position="static"
        color="primary"
        elevation={0}
        sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            {t('company.title')}
          </Typography>
          <div>
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              alignItems="center">
              <Grid item xs={'auto'}>
                <Link
                  component={RouterLink}
                  to={'/'}
                  variant="button"
                  color="text.primary"
                  underline="none"
                >
                  {t('navigation.links.home')}
                </Link>
              </Grid>
              <Grid item xs={'auto'}>
                <Link
                  component={RouterLink}
                  to={'/about'}
                  variant="button"
                  color="text.primary"
                  underline="none"
                >
                  {t('navigation.links.about')}
                </Link>
              </Grid>
              <Grid item xs={'auto'}>
                <Dropdown
                  options={languages}
                  selectedIndex={currentLangIdx}
                  setSelectedIndex={onChangeLanguage}
                ></Dropdown>
              </Grid>
              <Grid item xs={'auto'}>
                <Dropdown
                  options={themeNames}
                  selectedIndex={currentThemeIdx}
                  setSelectedIndex={onChangeThemeClick}
                ></Dropdown>
              </Grid>
            </Grid>
          </div>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Header
