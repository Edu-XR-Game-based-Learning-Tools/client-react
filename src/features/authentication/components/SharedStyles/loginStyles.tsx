import { createStyles, makeStyles } from '@mui/styles'

const useStyles = makeStyles(() =>
  createStyles({
    rootUsername: {
      border: '3px solid #ffffff',
      padding: '1rem',
      borderRadius: '1rem',
      color: '#ffffff',
      height: '4rem',
    },
    inputLabel: {
      fontSize: '1.5rem',
      color: '#ffffff',
      marginBottom: '0.6rem',
    },
    rootPasswordLabel: {
      marginTop: '1rem',
    },
    rootSignInButton: {
      margin: '3rem 0',
      color: 'white',
      height: '4rem',
      fontWeight: 'bold',
      fontSize: '2rem',
      fontFamily: 'Poppins',
      background: 'linear-gradient(268.44deg, #86C232 0%, rgba(97, 137, 47, 0.28) 100%)',
      borderRadius: '1rem',
    },
    rootDivider: {
      border: '1px solid #ffffff',
      flexGrow: 1,
    },
    rootOR: {
      fontSize: '2rem',
      fontFamily: 'Poppins',
      fontWeight: 'bold',
      color: '#ffffff',
      margin: '0 0.5rem',
    },
    rootSignUpButton: {
      color: 'white',
      fontSize: '2rem',
      fontFamily: 'Poppins',
      background:
        'linear-gradient(91.36deg, rgba(164, 80, 139, 0.85) 0.24%, rgba(95, 10, 135, 0.75) 100%)',
      borderRadius: '1rem',
      marginTop: '2rem',
    },
    rootFormContainer: {
      width: '75%',
    },
    error: {
      color: '#ff7373',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginTop: '0.6rem',
    },
  })
)

export default useStyles
