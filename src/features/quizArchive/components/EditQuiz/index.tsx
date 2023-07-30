/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button, Drawer, Grid, IconButton, TextField, Tooltip, Typography, styled } from '@mui/material'
import { blue, green, orange, red } from '@mui/material/colors'
import * as OV from 'online-3d-viewer'
import React, { useRef } from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'

import images from 'config/images'
import { AuthType } from 'features/authentication'
import { ReducerType } from 'store'

import Basic3DViewer from './basic3DViewer'

const mapStateToProps = (state: ReducerType) => ({
  authData: state.authentication.authData,
  isLoading: state.global.isLoading,
})

interface EditQuizProps {
  authData: AuthType
  isLoading: boolean
}

const TimerTextField = styled(TextField)({
  '& input:valid + fieldset': {
    borderColor: '#E0E3E7',
    borderWidth: 1,
  },
  '& input:invalid + fieldset': {
    borderColor: 'red',
    borderWidth: 1,
  },
  '& input:valid:focus + fieldset': {
    borderLeftWidth: 4,
    padding: '4px !important', // override inline-style
  },
});

const correctOptions = [false, false, true, false]
const optionColors = [red[500], blue[500], green[500], orange[500]]

const EditQuizContainer = (props: EditQuizProps) => {
  const { id } = useParams<{ id: string }>()

  React.useEffect(() => {
    OV.SetExternalLibLocation('libs')
    OV.Init3DViewerElements(null)
  })

  // #region Drawer
  const [isOpenDrawer, setIsOpenDrawer] = React.useState(false)
  const anchor = 'left'

  const toggleDrawer =
    (open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event &&
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return
        }

        setIsOpenDrawer(open)
      }

  const drawerItem = () => (
    <Grid container>
      <Grid item xs={2} display={'flex'} flexDirection={'column'} justifyContent={'space-between'}>
        <Typography textAlign={'center'}>
          {id}.
        </Typography>

        <Tooltip title="Delete question">
          <IconButton>
            <images.DeleteIcon />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid item xs={10}>
        <Button variant="text" onClick={toggleDrawer(false)}>
          <Grid display={'flex'} flexDirection={'column'}>
            <img width={'100%'} style={{ aspectRatio: '16/9' }} src='https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c?w=164&h=164&fit=crop&auto=format&dpr=2' />
            <Grid container spacing={0.5} marginTop={0}>
              {correctOptions.map((isCorrect, index) => (
                <Grid key={index} item xs={6} >
                  <Box
                    width={'100%'}
                    padding={0.5}
                    sx={{ backgroundColor: optionColors[index], aspectRatio: '4/1' }}>
                    {
                      isCorrect ?
                        <Box display={'flex'} alignItems={'center'} justifyContent={'center'}
                          height={'100%'}
                          sx={{ aspectRatio: '1/1', borderRadius: '50%', backgroundColor: 'white' }}>
                          <images.CheckIcon />
                        </Box>
                        : <></>
                    }
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Button>
      </Grid>
    </Grid>
  )

  const drawer = () => (
    <React.Fragment key={anchor}>
      <Drawer
        anchor={anchor}
        open={isOpenDrawer}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: '25vw' }}
        >
          {drawerItem()}
        </Box>
      </Drawer>
    </React.Fragment>
  )
  // #endregion End Drawer

  const questionTitle = () => (
    <Box position={'absolute'} top={0} left={0}>
      <Typography display={'inline'} paddingX={'1rem'}>Quiz ID: {id}</Typography>
      <Typography display={'inline'}>Question No: {id}/10</Typography>
      <br />
      <IconButton onClick={toggleDrawer(true)} style={{ marginLeft: '0.5rem' }}>
        {
          !isOpenDrawer ? <images.KeyboardDoubleArrowRightIcon />
            : <images.KeyboardDoubleArrowLeftIcon />
        }
      </IconButton>
    </Box>
  )

  const [duration, setDuration] = React.useState(10)

  const questionTimer = () => (
    <Box position={'absolute'} top={'50%'} left={0} paddingLeft={'1rem'}>
      <TimerTextField
        id="timer-validation-input"
        label="Timer"
        type="number"
        required
        value={duration}
        onChange={(evt) => { setDuration(parseInt(evt.target.value, 10)) }}
        variant="outlined"
        InputProps={{ inputProps: { min: 10, max: 240 } }}
        style={{ width: 'auto', borderRadius: '1rem' }}
      />
    </Box>
  )

  const [questionState, setQuestionState] = React.useState('')

  const question = () => (
    <Grid container spacing={0.5} marginTop={0} direction={'column'}>
      <Grid item xs={8} >
        <TextField
          type='text'
          required
          value={questionState}
          onChange={(evt) => { setQuestionState(evt.target.value) }}
          variant='outlined'
          multiline
          maxRows={12}
          sx={{
            input: { color: 'white', height: '100%' },
            '& .MuiInputBase-root,.MuiInputBase-root:hover': {
              height: '100%',
              backgroundColor: '#00000055',
              color: 'white',
              '& > fieldset': {
                borderColor: '#E0E3E755 !important',
                borderWidth: 1,
              },
            },
          }}
          style={{ width: '100%' }}
        />
      </Grid>
    </Grid>
  )

  const [visualState, setVisualState] = React.useState('3d')
  const [imageFile, setImageFile] = React.useState<File | null>(null)
  const [modelFile, setModelFile] = React.useState<File | null>(null)
  const inputFileRef = useRef() as React.MutableRefObject<HTMLInputElement>;;

  const visual = function visual() {
    const is3D = visualState === '3d'

    const btnSize = { height: '2rem', width: '2rem' };

    const button3d = (
      <IconButton style={{ backgroundColor: is3D ? blue[300] : 'white' }}
        disabled={is3D} onClick={() => { setVisualState('3d') }}>
        <images.ViewInAr style={{ ...btnSize }} />
      </IconButton>);
    const button2d = (
      <IconButton style={{ backgroundColor: !is3D ? blue[300] : 'white' }}
        disabled={!is3D} onClick={() => { setVisualState('2d') }}>
        <images.Image style={{ ...btnSize }} />
      </IconButton>);

    const activeFileType = "Based on Active File Type";
    const isAdd = !is3D ? imageFile === null : modelFile === null;

    const addOrUpdateButton = (
      <Tooltip title={isAdd ? `Add ${activeFileType}` : `Update ${activeFileType}`}>
        <IconButton style={{ backgroundColor: 'white' }} onClick={() => inputFileRef.current.click()}>
          {isAdd
            ? <images.AddIcon style={{ ...btnSize }} />
            : <images.EditIcon style={{ ...btnSize }} />}
        </IconButton>
      </Tooltip>)

    const modelView = () => (modelFile == null ?
      <Box style={{ ...btnSize, alignSelf: 'center' }}>{addOrUpdateButton}</Box> :
      <Box style={{
        width: '100%', height: '100%', border: '2px solid', position: 'absolute', display: !is3D ? 'none' : 'block'
      }}>
        <Basic3DViewer file={modelFile} />
      </Box>
    )
    const imageView = () => (imageFile == null ?
      <Box style={{ ...btnSize, alignSelf: 'center' }}>{addOrUpdateButton}</Box> :
      <img style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} src={URL.createObjectURL(imageFile!)} />)

    return (
      <Grid container spacing={0.5} marginTop={0} marginRight={'5rem'} direction={'column'}>
        <Box height={'95%'} position={'relative'} display={'flex'} alignItems={'start'} justifyContent={isAdd ? 'center' : 'right'} paddingRight={'1rem'} >
          {modelView()}
          {!is3D ? imageView() : <></>}
          <Box position={'absolute'} left={'100%'} display={'flex'} flexDirection={'column'} gap={1}>
            {!is3D ? <Tooltip title="3D Model">
              {button3d}
            </Tooltip> : button3d}
            {is3D ? <Tooltip title="Image">
              {button2d}
            </Tooltip> : button2d}
            {addOrUpdateButton}
            <Tooltip title={`Remove ${activeFileType}`}>
              <IconButton style={{ backgroundColor: 'white' }} onClick={() =>
                !is3D ? setImageFile(null) : setModelFile(null)
              }>
                <images.DeleteIcon style={{ ...btnSize }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <input
          ref={inputFileRef}
          onClick={(evt) => {
            evt.currentTarget.value = ''; // Reset selected file
          }}
          onChange={(evt) => {
            if (evt.target.files?.length === 0 ?? false) return;

            if (!is3D) setImageFile(evt.target.files![0]);
            else setModelFile(evt.target.files![0]);
            // inputFileRef.current.files = null;
          }} type="file" hidden accept={!is3D ? 'image/*' : '.gltf, .fbx, .obj'} />
      </Grid >
    );
  }

  const [answers, setAnswers] = React.useState<string[]>([])
  const [optionStates, setOptionStates] = React.useState<boolean[]>([true, false, false, false])

  const options = () => (
    <Grid container rowSpacing={1} columnSpacing={3} marginRight={'5rem'}>
      {optionStates.map((isCorrect, index) => (
        <Grid key={index} item xs={6} >
          <Box
            padding={2}
            gap={2}
            sx={{
              backgroundColor: optionColors[index],
              height: '8rem',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
            }}>
            {
              isCorrect ?
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'}
                  height={'100%'}
                  sx={{ aspectRatio: '1/1', borderRadius: '50%', backgroundColor: 'white' }}>
                  <images.CheckIcon />
                </Box>
                :
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'}
                  height={'100%'}
                  sx={{ aspectRatio: '1/1', borderRadius: '50%', backgroundColor: 'white', cursor: 'pointer' }}
                  onClick={() => { setOptionStates(optionStates.map((_, idx) => idx === index)) }}
                >
                </Box>
            }
            <TextField
              type='text'
              required
              value={answers[index]}
              onChange={(evt) => { setAnswers(answers.map((ele, idx) => idx === index ? evt.target.value : ele)) }}
              variant='outlined'
              multiline
              maxRows={4}
              sx={{
                input: { color: 'white', height: '100%' },
                '& .MuiInputBase-root,.MuiInputBase-root:hover': {
                  height: '100%',
                  color: 'white',
                  '& > fieldset': {
                    borderColor: '#E0E3E755 !important',
                    borderWidth: 1,
                  },
                },
              }}
              style={{ width: '100%', height: '100%' }}
            />
          </Box>
        </Grid>
      ))}
    </Grid>
  )

  return (
    <Box position={'relative'} padding={'4rem 0 0 5rem'} minHeight={'calc(100vh - 7rem)'}>
      <Box sx={{ display: 'flex', height: 'calc(100vh - 12rem)', flexDirection: 'column' }} >
        <Grid container item xs={12} spacing={5}>
          <Grid container item xs={5}>
            {question()}
          </Grid>
          <Grid container item xs={7}>
            {visual()}
          </Grid>
        </Grid>
        <Grid container item >
          {options()}
        </Grid>
      </Box>
      {questionTitle()}
      {questionTimer()}
      {drawer()}
    </Box>
  )
}

export default connect(mapStateToProps)(EditQuizContainer)
