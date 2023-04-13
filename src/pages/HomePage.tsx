import { useTranslation } from 'react-i18next'

import 'App.css'
import { PostContainer } from 'features/posts'
import LibComponent from 'libs/ui/components/Loading'
import TitleTypography from 'libs/ui/components/TitleTypography'

const Page = () => {
  const { t } = useTranslation()
  // const isLoading = state.global.isLoading

  return (
    <>
      <TitleTypography title={t('home.title')} />
      <PostContainer />
      <LibComponent isLoading={false} />
    </>
  )
}

export default Page
