import { useTranslation } from 'react-i18next'

import ArchiveContainer from 'features/quizArchive/components'
import TitleTypography from 'libs/ui/components/TitleTypography'

const Page = () => {
  const { t } = useTranslation()

  return <>
    <TitleTypography title={t('archive.title')} />
    <ArchiveContainer />
  </>
}

export default Page
