import { createStyles, makeStyles } from '@mui/styles'

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      minHeight: '100vh',
      background: 'linear-gradient(107.56deg, #222629 12.02%, #1E453E 62.02%)',
    },
    rootApp: {
      padding: '5rem 0 0 8rem',
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
    slogan: {
      fontSize: '4rem',
      fontWeight: 'bold',
      background: '-webkit-linear-gradient(180deg, #B3B990 100%, #86C232 47%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontFamily: 'Poppins',
    },
    rootFun: {
      fontSize: '6rem',
      background: '-webkit-linear-gradient(180deg, #86C232 100%, #86C232 100%)',
      WebkitBackgroundClip: 'text',
      fontWeight: 'bold',
      WebkitTextFillColor: 'transparent',
      fontFamily: 'Poppins',
    },
    backdrop: {
      zIndex: 1,
      color: '#fff',
    },
  })
)

export default useStyles
