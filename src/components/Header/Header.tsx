/* eslint-disable @typescript-eslint/no-unused-vars */
import LogoutIcon from '@mui/icons-material/Logout'
import { Button, Grid, Link } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { NavLink as RouterLink } from 'react-router-dom'

import { languages } from 'config/i18n'
import images from 'config/images'
import { logout } from 'libs/core/configureAxios'
import LibComponent from 'libs/ui/components/Dropdown'
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

  const onLogoutClick = () => {
    logout()
  }

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
        style={{
          background: 'linear-gradient(0, rgb(187 221 255), rgb(69 91 123))',
          border: 0
        }}
      >
        <Toolbar>
          <Link
            component={RouterLink}
            to={'/'}
            variant="button"
            color="text.primary"
            underline="none"
            display={'flex'}
            alignItems={'center'}
          >
            <img src={images.AppIcon} alt={images.AppIcon} style={{ height: '2em' }} />
            <Typography style={{
              fontSize: '1.5rem',
              background: '-webkit-linear-gradient(180deg, #FCE38A 0%, #CC2A2A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginLeft: '0.5rem',
            }}>{t('company.title')}
            </Typography>
          </Link>
          <Grid container flexGrow={1} justifyContent={'flex-end'} rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            alignItems="center">
            <Grid item xs={'auto'}>
              <Link
                component={RouterLink}
                to={'/archive'}
                variant="button"
                color="text.primary"
                underline="none"
              >
                {t('navigation.links.archive')}
              </Link>
            </Grid>
            {/* <Grid item xs={'auto'}>
              <LibComponent
                options={languages}
                selectedIndex={currentLangIdx}
                setSelectedIndex={onChangeLanguage}
              ></LibComponent>
            </Grid>
            <Grid item xs={'auto'}>
              <LibComponent
                options={themeNames}
                selectedIndex={currentThemeIdx}
                setSelectedIndex={onChangeThemeClick}
              ></LibComponent>
            </Grid> */}
            <Grid item xs={'auto'}>
              <Button onClick={onLogoutClick}>
                <LogoutIcon />
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar >
    </>
  )
}

export default Header
