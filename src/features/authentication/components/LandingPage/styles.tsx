import { createStyles, makeStyles } from '@mui/styles'

import images from 'config/images'

const useStyles = makeStyles(() =>
  createStyles({
    rootDialogPaper: {
      padding: '5rem 8rem',
    },
    rootContainer: {
      background: `linear-gradient(225.7deg, #222629 44.91%, #1E453E 60.82%)`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    },
    rootPageCover: {
      position: 'absolute',
      height: '100%',
      width: '60%',
      bottom: 0,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      background: `url("${images.LandingPageCover}")`,
      backgroundPosition: 'bottom',
      opacity: 0.4,
    },
    rootAppNameContainer: {
      height: 'fit-content',
    },
    rootAppName: {
      fontSize: '5rem',
      fontFamily: 'Poppins',
      background: '-webkit-linear-gradient(180deg, #FCE38A 0%, #CC2A2A 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginLeft: '2rem',
    },
    rootTypo: {
      fontFamily: 'Poppins',
      fontSize: '5rem',
      color: 'white',
    },
    rootStudy: {
      color: '#19A186',
      fontSize: '6rem',
    },
    rootPlay: {
      color: '#86C232',
      fontSize: '6rem',
    },
    rootTypoType2: {
      fontFamily: 'Poppins',
      fontSize: '2rem',
      color: 'white',
    },
    rootButton: {
      height: '5rem',
      color: 'white',
      backgroundColor: '#61892F',
      marginRight: '10%',
      marginTop: '6rem',
      fontSize: '1.8rem',
      width: '20%',
    },
  })
)

export default useStyles
