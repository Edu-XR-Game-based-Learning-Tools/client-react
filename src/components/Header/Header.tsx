/* eslint-disable @typescript-eslint/no-unused-vars */
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import LogoutIcon from '@mui/icons-material/Logout'
import { Button, Grid, IconButton, Link } from '@mui/material'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { NavLink as RouterLink } from 'react-router-dom'

import { languages } from 'config/i18n'
import images from 'config/images'
import { logout } from 'libs/core/configureAxios'
import { onDownloadXRApp } from 'libs/core/firebase'
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

  const {
    currentThemeIdx,
    currentLangIdx,
    onChangeThemeClick,
    onChangeLanguageClick: onChangeLanguage,
  } = props

  const onLogoutClick = () => {
    logout()
  }

  const navColor = '#f6cd7f'

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
        style={{
          background: '#222',
          border: 0,
        }}
      >
        <Toolbar>
          <Link
            component={RouterLink}
            to={'/'}
            variant="button"
            underline="none"
            display={'flex'}
            alignItems={'center'}
          >
            <img src={images.AppIcon} alt={images.AppIcon} style={{ height: '2em' }} />
            <Typography
              style={{
                fontSize: '1.5rem',
                background: '-webkit-linear-gradient(180deg, #FCE38A 0%, #CC2A2A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginLeft: '0.5rem',
              }}
            >
              {t('company.title')}
            </Typography>
          </Link>
          <Grid
            container
            flexGrow={1}
            justifyContent={'flex-end'}
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            alignItems="center"
          >
            <Grid item xs={'auto'}>
              <IconButton size="large" aria-label="Download Game" onClick={onDownloadXRApp}>
                <CloudDownloadIcon style={{ color: '#86C232' }} fontSize="large" />
              </IconButton>
              <Link
                component={RouterLink}
                to={'/archive'}
                variant="button"
                underline="none"
                style={{ marginLeft: '1rem', fontWeight: 'bold', fontSize: '1rem', color: navColor }}
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
                <LogoutIcon style={{ color: navColor }} />
              </Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Header
