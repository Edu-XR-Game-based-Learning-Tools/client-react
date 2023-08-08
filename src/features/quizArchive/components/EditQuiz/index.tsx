/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button, Drawer, Grid, IconButton, TextField, Tooltip, Typography, styled } from '@mui/material'
import { blue, green, orange, red } from '@mui/material/colors'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit/dist/createAction'
import { getDownloadURL, uploadBytes } from "firebase/storage"
import * as OV from 'online-3d-viewer'
import React, { useRef } from 'react'
import { connect, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import images from 'config/images'
import { AuthType } from 'features/authentication'
import { globalActions } from 'features/global/store/slice'
import useQuizArchiveService from 'features/quizArchive/hooks'
import { getJwtData } from 'libs/core/configureAxios'
import { getQuizStorageRef } from 'libs/core/firebase'
import LoadingComponent from 'libs/ui/components/Loading'
import usePrompt from 'libs/utility/usePrompt'
import { ReducerType, RootState } from 'store'
import { useAppDispatch } from 'store/hooks'

import { QuizCollectionDto, initQuizCollectionDto, initQuizDto } from '../../types'

import Basic3DViewer from './basic3DViewer'

const mapStateToProps = (state: ReducerType) => ({
  authData: state.authentication.authData,
  isLoading: state.global.isLoading,
  setIsLoading: globalActions.setIsLoading,
  editCollection: state.quizArchive.editCollection,
})

interface EditQuizProps {
  authData: AuthType
  isLoading: boolean
  setIsLoading: ActionCreatorWithPayload<boolean, "global/setIsLoading">
  editCollection: QuizCollectionDto
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
})

const optionColors = [red[500], blue[500], green[500], orange[500]]

const EditQuizContainer = (props: EditQuizProps) => {
  const isFirstLoad = useRef(true)
  const { id } = useParams<{ id: string }>()
  const { isLoading, setIsLoading } = props
  const editCollectionSelector = useSelector((state: RootState) => state.quizArchive.editCollection);
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { getQuizCollection, updateQuizCollection } = useQuizArchiveService()
  const [collectionData, setCollectionData] = React.useState<QuizCollectionDto>(initQuizCollectionDto)
  const [activeQuizIndex, setActiveQuizIndex] = React.useState<number>(0)
  const currentQuiz = React.useCallback(() => collectionData.quizzes[activeQuizIndex], [collectionData, activeQuizIndex])

  const btnSize = { height: '2rem', width: '2rem' }

  // Image & Model
  const [visualState, setVisualState] = React.useState('3d')
  const [imageFile, setImageFile] = React.useState<File | null>(null)
  const [modelFile, setModelFile] = React.useState<File | null>(null)
  const inputFileRef = useRef() as React.MutableRefObject<HTMLInputElement>
  const isNotQuizImage = React.useCallback(() => !(imageFile || currentQuiz().image), [currentQuiz, imageFile])
  const isNotQuizModel = React.useCallback(() => !(modelFile || currentQuiz().model), [currentQuiz, modelFile])

  // #region First Load Fetch
  React.useEffect(() => {
    OV.SetExternalLibLocation('libs')
    OV.Init3DViewerElements(null)
  }, [])

  React.useEffect(() => {
    const eid = parseInt(id ?? '', 10)
    if (Number.isNaN(eid)) {
      alert('Invalid Url Params') // eslint-disable-line no-alert
      navigate('/')
    }
    else
      getQuizCollection(eid)
  }, [dispatch, getQuizCollection, id, navigate])

  React.useEffect(() => {
    if (!isFirstLoad.current && !editCollectionSelector.eId) {
      alert('Invalid Quiz') // eslint-disable-line no-alert
      navigate('/')
    }
    isFirstLoad.current = false
    setImageFile(null)
    setModelFile(null)
    setCollectionData(editCollectionSelector)
    setActiveQuizIndex((prev) => {
      if (prev > editCollectionSelector.quizzes.length - 1)
        return 0
      return prev
    })
  }, [editCollectionSelector, navigate])
  // #endregion First Load Fetch

  React.useEffect(() => {
    if (collectionData.quizzes.length)
      setVisualState(collectionData.quizzes[activeQuizIndex].image ? '2d' : '3d')
  }, [activeQuizIndex, collectionData.quizzes])

  // #region Data Manipulation
  const checkIfIsChangeAndNotSave = React.useCallback((): boolean => {
    if (collectionData !== editCollectionSelector ||
      JSON.stringify(collectionData.quizzes) !== JSON.stringify(editCollectionSelector.quizzes)) {
      return false
    }
    return true
  }, [collectionData, editCollectionSelector])

  usePrompt(
    'The changes won\'t be saved, is it ok?',
    !checkIfIsChangeAndNotSave(),
  )

  const checkIfQuizIsChangeAndNotSave = React.useCallback((): boolean => {
    if (JSON.stringify(collectionData.quizzes[activeQuizIndex]) !== JSON.stringify(editCollectionSelector.quizzes[activeQuizIndex])) {
      return window.confirm('The changes won\'t be saved, is it ok?') // eslint-disable-line no-alert
    }
    return true
  }, [activeQuizIndex, collectionData.quizzes, editCollectionSelector.quizzes])

  const uploadQuizFile = React.useCallback(async (file: File) => {
    const jwtData = getJwtData()
    if (!jwtData) {
      alert('Invalid Token Data') // eslint-disable-line no-alert
      navigate('/')
      return null
    }
    const storageRef = getQuizStorageRef(`${jwtData.id}/${file.name}`)
    const response = await uploadBytes(storageRef, file)
    const url = await getDownloadURL(response.ref)
    return url
  }, [navigate])

  const assignFileToQuiz = React.useCallback(async () => {
    dispatch(setIsLoading(true))
    const promiseFunc = []
    if (imageFile)
      promiseFunc.push(uploadQuizFile(imageFile))
    if (modelFile)
      promiseFunc.push(uploadQuizFile(modelFile))

    const urls = await Promise.all(promiseFunc)

    if (imageFile)
      [currentQuiz().image] = urls
    if (modelFile)
      currentQuiz().model = urls[urls.length - 1]
    dispatch(setIsLoading(false))
  }, [currentQuiz, dispatch, imageFile, modelFile, setIsLoading, uploadQuizFile])

  const validateForm = React.useCallback((): string => {
    if (!currentQuiz().question || !currentQuiz().question.trim())
      return 'Question cannot be empty'
    if (!currentQuiz().answers || currentQuiz().answers.filter((answer) => answer.trim()).length < 2)
      return 'At least two non-empty answers should be filled'
    if (!currentQuiz().duration || currentQuiz().duration < 10 || currentQuiz().duration > 240)
      return 'Duration should be between 10 and 240 seconds'
    if (isNotQuizImage() && isNotQuizModel())
      return 'Quiz should contains at least image or model to visualize'
    return ''
  }, [currentQuiz, isNotQuizImage, isNotQuizModel])

  const handleSaveClick = React.useCallback(async () => {
    const validateMsg = validateForm()
    if (validateMsg) {
      alert(validateMsg) // eslint-disable-line no-alert
      return
    }

    dispatch(setIsLoading(true))
    await assignFileToQuiz()
    updateQuizCollection(collectionData)
    dispatch(setIsLoading(false))
  }, [validateForm, dispatch, setIsLoading, assignFileToQuiz, updateQuizCollection, collectionData])

  const handleDeleteClick = React.useCallback(async () => {
    if (window.confirm('Are you sure you want to delete this question?')) // eslint-disable-line no-alert
    {
      setCollectionData((prev) => {
        const isNewQuestion = prev.quizzes[activeQuizIndex].eId === null
        const quizzes = prev.quizzes.filter((_, idx) =>
          activeQuizIndex !== idx)
        const newData = { ...prev, quizzes }
        if (!isNewQuestion) updateQuizCollection(newData)
        setActiveQuizIndex((prev1) => {
          if (prev1 > quizzes.length - 1)
            return 0
          return prev1
        })
        return newData
      })
    }
  }, [activeQuizIndex, updateQuizCollection])

  const handleDeleteVisual = React.useCallback(() => {
    const is3D = visualState === '3d'
    if (!is3D) {
      if (imageFile)
        setImageFile(null)
      else
        setCollectionData((prev) => {
          const quizzes = prev.quizzes.map((quiz, idx) =>
            activeQuizIndex === idx ? { ...quiz, image: null } : quiz)
          const newData = { ...prev, quizzes }
          return newData
        })
    }
    else if (modelFile) {
      setModelFile(null)
    }
    else {
      setCollectionData((prev) => {
        const quizzes = prev.quizzes.map((quiz, idx) =>
          activeQuizIndex === idx ? { ...quiz, model: null } : quiz)
        const newData = { ...prev, quizzes }
        return newData
      })
    }
  }, [activeQuizIndex, imageFile, modelFile, visualState])
  // #endregion Data Manipulation

  // #region Drawer
  const [isOpenDrawer, setIsOpenDrawer] = React.useState(false)
  const anchor = 'left'

  const toggleDrawer = React.useCallback((open: boolean) => {
    setIsOpenDrawer(open)
  }, [])

  const handleAddNewClick = React.useCallback(() => {
    if (!checkIfQuizIsChangeAndNotSave()) return
    setCollectionData((prev) => {
      const newData = { ...prev, quizzes: [...prev.quizzes, initQuizDto] }
      return newData
    })
    setActiveQuizIndex(collectionData.quizzes.length)
    toggleDrawer(false)
  }, [checkIfQuizIsChangeAndNotSave, collectionData.quizzes.length, toggleDrawer])

  const drawerAddNewQuiz = () => (
    <Box display={'flex'} justifyContent={'center'} style={{ marginTop: '0.5rem' }}>
      <IconButton onClick={handleAddNewClick} style={{ width: '100%', borderRadius: '0' }}>
        {collectionData.quizzes.length > 0 ? '' : 'Empty Quiz, Add?'}
        <images.AddIcon />
      </IconButton>
    </Box>
  )

  const handleSelectQuizClick = React.useCallback((index: number) => {
    if (!checkIfQuizIsChangeAndNotSave()) return
    setActiveQuizIndex(index)
    toggleDrawer(false)
  }, [checkIfQuizIsChangeAndNotSave, toggleDrawer])

  const drawerItem = (index: number) => {
    const quizData = collectionData.quizzes[index]
    return (
      <Grid key={`drawer-${index}`} container>
        <Grid item xs={2} display={'flex'} flexDirection={'column'} justifyContent={'space-between'}>
          <Typography textAlign={'center'}>
            {index + 1}.{quizData.name}
          </Typography>

          <Tooltip title="Delete question">
            <IconButton>
              <images.DeleteIcon />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs={10}>
          <Button variant="text" onClick={() => handleSelectQuizClick(index)} style={{ width: '100%' }}>
            <Grid display={'flex'} flexDirection={'column'} style={{ width: '100%' }}>
              <img width={'100%'} style={{ aspectRatio: '16/9' }} alt='image-banner' src={quizData.image!} />
              <Grid container spacing={0.5} marginTop={0}>
                {quizData.answers.map((_, idx) => (
                  <Grid key={`drawer-answer-${index}-${idx}`} item xs={6} >
                    <Box
                      width={'100%'}
                      padding={0.5}
                      sx={{ backgroundColor: optionColors[idx], aspectRatio: '4/1' }}>
                      {
                        idx === quizData.correctIdx ?
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
  }

  const drawer = () => (
    <React.Fragment key={anchor}>
      <Drawer
        anchor={anchor}
        open={isOpenDrawer}
        onClose={() => toggleDrawer(false)}
      >
        <Box
          sx={{ width: '25vw' }}
        >
          {
            collectionData.quizzes.length > 0 ?
              collectionData.quizzes.map((_, index) =>
                drawerItem(index)
              )
              : <></>
          }
          {drawerAddNewQuiz()}
        </Box>
      </Drawer>
    </React.Fragment>
  )
  // #endregion End Drawer

  const questionTitle = () => (
    <Grid container display={'flex'} justifyContent={'space-between'} padding={'0 2rem'} marginBottom={'1rem'}>
      <Box>
        <Typography display={'inline'} paddingX={'1rem'}>Quiz ID: {currentQuiz().eId ?? '-'}</Typography>
        <Typography display={'inline'}>Question No: {activeQuizIndex + 1}/{collectionData.quizzes.length}</Typography>
        <br />
        <IconButton onClick={() => toggleDrawer(true)} style={{ marginLeft: '0.5rem' }}>
          {
            !isOpenDrawer ? <images.KeyboardDoubleArrowRightIcon />
              : <images.KeyboardDoubleArrowLeftIcon />
          }
        </IconButton>
      </Box>
      <Box>
        <Tooltip title={'Save'} sx={{ marginRight: '1rem' }}>
          <IconButton style={{ backgroundColor: 'white' }} onClick={handleSaveClick}>
            <images.SaveIcon style={{ ...btnSize }} />
          </IconButton>
        </Tooltip>
        <Tooltip title={'Delete'}>
          <IconButton style={{ backgroundColor: 'white' }} onClick={handleDeleteClick}>
            <images.DeleteIcon style={{ ...btnSize }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Grid >
  )

  const questionTimer = () => (
    <Box position={'absolute'} top={'50%'} left={0} paddingLeft={'1rem'}>
      <TimerTextField
        id="timer-validation-input"
        label="Timer"
        type="number"
        required
        value={currentQuiz().duration}
        onChange={(evt) => {
          setCollectionData((prev) => {
            const quizzes = prev.quizzes.map((quiz, idx) =>
              activeQuizIndex === idx ? { ...quiz, duration: parseInt(evt.target.value, 10) } : quiz)
            const newData = { ...prev, quizzes }
            return newData
          })
        }}
        variant="outlined"
        InputProps={{ inputProps: { min: 10, max: 240 } }}
        style={{ width: 'auto', borderRadius: '1rem' }}
      />
    </Box>
  )

  const question = () => (
    <Grid container spacing={0.5} marginTop={0} direction={'column'}>
      <Grid item xs={8} >
        <TextField
          type='text'
          required
          value={currentQuiz().question}
          onChange={(evt) => {
            setCollectionData((prev) => {
              const quizzes = prev.quizzes.map((quiz, idx) =>
                activeQuizIndex === idx ? { ...quiz, question: evt.target.value } : quiz)
              const newData = { ...prev, quizzes }
              return newData
            })
          }}
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

  const visual = function visual() {
    const is3D = visualState === '3d'

    const button3d = (
      <IconButton style={{ backgroundColor: is3D ? blue[300] : 'white' }}
        disabled={is3D} onClick={() => { setVisualState('3d') }}>
        <images.ViewInAr style={{ ...btnSize }} />
      </IconButton>)
    const button2d = (
      <IconButton style={{ backgroundColor: !is3D ? blue[300] : 'white' }}
        disabled={!is3D} onClick={() => { setVisualState('2d') }}>
        <images.Image style={{ ...btnSize }} />
      </IconButton>)

    const activeFileTypeString = () => is3D ? 'model' : 'image'
    const isAdd = !is3D ? isNotQuizImage() : isNotQuizModel()

    const addOrUpdateButton = (
      <Tooltip title={isAdd ? `Add ${activeFileTypeString()}` : `Update ${activeFileTypeString()}`}>
        <IconButton style={{ backgroundColor: 'white' }} onClick={() => inputFileRef.current.click()}>
          {isAdd
            ? <images.AddIcon style={{ ...btnSize }} />
            : <images.EditIcon style={{ ...btnSize }} />}
        </IconButton>
      </Tooltip>)

    const modelView = () => (isNotQuizModel() ?
      <Box style={{ ...btnSize, alignSelf: 'center', display: !is3D ? 'none' : 'block' }}>{addOrUpdateButton}</Box> :
      <Box style={{
        width: '100%', height: '100%', border: '2px solid', position: 'absolute', display: !is3D ? 'none' : 'block'
      }}>
        <Basic3DViewer file={modelFile} url={currentQuiz().model} />
      </Box>
    )
    const imageView = () => (isNotQuizImage() ?
      <Box style={{ ...btnSize, alignSelf: 'center' }}>{addOrUpdateButton}</Box> :
      <img style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} src={!imageFile ? currentQuiz().image! : URL.createObjectURL(imageFile)} />)

    return (
      <Grid container spacing={0.5} marginTop={0} marginRight={'5rem'} direction={'column'} flexGrow={1}>
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
            {
              is3D && !isNotQuizModel() || !is3D && !isNotQuizImage() ?
                <Tooltip title={`Remove ${activeFileTypeString()}`}>
                  <IconButton style={{ backgroundColor: 'white' }} onClick={() => handleDeleteVisual()}>
                    <images.DeleteIcon style={{ ...btnSize }} />
                  </IconButton>
                </Tooltip>
                : <></>
            }
          </Box>
        </Box>
        <input
          ref={inputFileRef}
          onClick={(evt) => {
            evt.currentTarget.value = '' // Reset selected file
          }}
          onChange={(evt) => {
            if (evt.target.files?.length === 0 ?? false) return

            if (!is3D) setImageFile(evt.target.files![0])
            else setModelFile(evt.target.files![0])
            // inputFileRef.current.files = null
          }} type="file" hidden accept={!is3D ? 'image/*' : '.gltf, .fbx, .obj'} />
      </Grid >
    )
  }

  const options = () => (
    <Grid container rowSpacing={1} columnSpacing={3} marginRight={'5rem'}>
      {currentQuiz().answers.map((_, index) => (
        <Grid key={`answer-${index}`} item xs={6} >
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
              currentQuiz().correctIdx === index ?
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'}
                  height={'100%'}
                  sx={{ aspectRatio: '1/1', borderRadius: '50%', backgroundColor: 'white' }}>
                  <images.CheckIcon />
                </Box>
                :
                <Box display={'flex'} alignItems={'center'} justifyContent={'center'}
                  height={'100%'}
                  sx={{ aspectRatio: '1/1', borderRadius: '50%', backgroundColor: 'white', cursor: 'pointer' }}
                  onClick={() => {
                    setCollectionData((prev) => {
                      const quizzes = prev.quizzes.map((quiz, idx) =>
                        activeQuizIndex === idx ? { ...quiz, correctIdx: index } : quiz)
                      const newData = { ...prev, quizzes }
                      return newData
                    })
                  }}
                >
                </Box>
            }
            <TextField
              type='text'
              required
              value={currentQuiz().answers[index]}
              onChange={(evt) => {
                setCollectionData((prev) => {
                  const answers = prev.quizzes[activeQuizIndex].answers.map((ans, idx) =>
                    index === idx ? evt.target.value : ans)
                  const quizzes = prev.quizzes.map((quiz, idx) =>
                    activeQuizIndex === idx ? { ...quiz, answers } : quiz)
                  const newData = { ...prev, quizzes }
                  return newData
                })
              }}
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

  const content = () => (
    collectionData.quizzes.length === 0 ?
      drawerAddNewQuiz()
      :
      <Box position={'relative'} minHeight={'calc(100vh - 7rem)'} display={'flex'} flexDirection={'column'}>
        {questionTitle()}
        <Box sx={{ display: 'flex', minHeight: '100%', flexDirection: 'column', paddingLeft: '5rem', flexGrow: 1 }} >
          <Grid container item xs={12} spacing={5} sx={{ flexGrow: '1 !important' }}>
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
        {questionTimer()}
        {drawer()}
      </Box>
  )

  return <div>
    {content()}
    <LoadingComponent isLoading={isLoading} />
  </div>
}

export default connect(mapStateToProps)(EditQuizContainer)
