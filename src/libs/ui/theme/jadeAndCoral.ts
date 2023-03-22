import { createTheme } from '@mui/material/styles'

export default createTheme({
  palette: {
    mode: 'light',
    primary: {
      light: '#F2EFE9',
      main: '#e8e5df',
      dark: '#bfbdb7'
    },
    secondary: {
      light: '#00A896',
      main: '#008b7a',
      dark: '#09554c'
    },
    error: {
      light: '#FF6B6B',
      main: '#ff5436',
      dark: '#8f001a'
    },
    text: {
      disabled: '#bfbdb7',
      secondary: '#5c5c5c',
      primary: '#333333'
    },
  },
})
