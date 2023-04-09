import { useTranslation } from 'react-i18next'

import TitleTypography from 'libs/ui/components/TitleTypography'

const Page = () => {
  const { t } = useTranslation()

  return <TitleTypography title={t('about.title')} />
}

export default Page
