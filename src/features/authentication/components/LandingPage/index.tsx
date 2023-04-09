/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Dialog, Grid, Typography } from '@mui/material'
import { memo, useState } from 'react'
import { connect } from 'react-redux'

import images from 'config/images'
import { ReducerType } from 'store'

import useStyles from './styles'

const mapStateToProps = (state: ReducerType) => ({})

// eslint-disable-next-line react/display-name, @typescript-eslint/ban-types
const LandingPage = memo((_props: {}) => {
  const [open, setOpen] = useState(true)
  const classes = useStyles()

  const closeDialog = () => {
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      fullScreen
      onClose={closeDialog}
      aria-labelledby="form-dialog-title"
      classes={{ paperFullScreen: classes.rootContainer }}>
      <div className={classes.rootPageCover}></div>
      <Grid container classes={{ root: classes.rootDialogPaper }}>
        <Grid container classes={{ root: classes.rootAppNameContainer }}>
          <img src={images.AppIcon} alt={images.AppIcon} />
          <Typography classes={{ root: classes.rootAppName }}>GBLT</Typography>
        </Grid>
        <Grid container alignItems="flex-end" direction="column">
          <Typography classes={{ root: classes.rootTypo }}>
            <span className={classes.rootStudy}>Study. </span> And.
            <span className={classes.rootPlay}> Play.</span>
          </Typography>
          <Typography classes={{ root: classes.rootTypoType2 }}>
            Come join now and share knowledge with others.
          </Typography>
          <Button onClick={closeDialog} classes={{ root: classes.rootButton }}>
            Join now
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  )
})

export default connect(mapStateToProps)(LandingPage)
