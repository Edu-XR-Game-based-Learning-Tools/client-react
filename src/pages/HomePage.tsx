import { Button, Tooltip } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import 'App.css'
import LoadingComponent from 'libs/ui/components/Loading'
import TitleTypography from 'libs/ui/components/TitleTypography'

const Page = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleNavigateArchiveClick = React.useCallback(() => {
    navigate('/archive')
  }, [navigate])

  return (
    <>
      <TitleTypography title={t('home.title')} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Tooltip title="Go to Your Archive">
          <Button onClick={handleNavigateArchiveClick} style={{ borderRadius: '0' }}>
            <img style={{ maxHeight: '60vh' }} src='https://cdn.dribbble.com/users/879059/screenshots/4034854/ksam_archive_by_joakim_agervald.gif' />
          </Button>
        </Tooltip>
      </div>
      <LoadingComponent isLoading={false} />
    </>
  )
}

export default Page
