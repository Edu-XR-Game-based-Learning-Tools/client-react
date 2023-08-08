/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Dialog, Grid, Typography } from '@mui/material'
import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'

import images from 'config/images'
import { ReducerType } from 'store'

const mapStateToProps = (state: ReducerType) => ({})

// eslint-disable-next-line react/display-name, @typescript-eslint/ban-types
const LandingPage = memo((_props: {}) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(true)

  const closeDialog = () => {
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      fullScreen
      onClose={closeDialog}
      aria-labelledby="form-dialog-title"
      sx={{
        background: 'linear-gradient(225.7deg, #222629 44.91%, #1E453E 60.82%)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        '& .MuiDialog-container .MuiPaper-root': {
          backgroundColor: 'transparent',
        },
      }}>
      <div style={{
        position: 'absolute',
        height: '100%',
        width: '60%',
        bottom: 0,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url("${images.LandingPageCover}")`,
        backgroundPosition: 'bottom',
        opacity: 0.4,
      }}></div>
      <Grid container style={{
        padding: '5rem 8rem',
      }}>
        <Grid container style={{
          height: 'fit-content',
        }}>
          <img src={images.AppIcon} alt={images.AppIcon} />
          <Typography style={{
            fontSize: '5rem',
            fontFamily: 'Poppins',
            background: 'linear-gradient(180deg, #FCE38A 0%, #CC2A2A 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginLeft: '2rem',
          }}>{t('company.title')}</Typography>
        </Grid>
        <Grid container alignItems="flex-end" direction="column">
          <Typography style={{
            fontFamily: 'Poppins',
            fontSize: '5rem',
            color: 'white',
          }}>
            <span style={{
              color: '#19A186',
              fontSize: '6rem',
            }}>Study. </span> And.
            <span style={{
              color: '#86C232',
              fontSize: '6rem',
            }}> Play.</span>
          </Typography>
          <Typography style={{
            fontFamily: 'Poppins',
            fontSize: '2rem',
            color: 'white',
          }}>
            Come join now and share knowledge with others.
          </Typography>
          <Button onClick={closeDialog} style={{
            height: '5rem',
            color: 'white',
            backgroundColor: '#61892F',
            marginRight: '10%',
            marginTop: '6rem',
            fontSize: '1.8rem',
            width: '20%',
          }}>
            Join now
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  )
})

export default connect(mapStateToProps)(LandingPage)
