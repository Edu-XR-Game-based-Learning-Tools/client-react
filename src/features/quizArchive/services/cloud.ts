import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"

import { app } from "libs/core/firebase"

// const BASE_URL = `gs://user-e8717.appspot.com/quiz-file-upload`
const BASE_REF = `quiz-file-upload`

const storage = getStorage(app)

export const uploadFile = async (file: File, postFix: string): Promise<string> => {
  const storageRef = ref(storage, `${BASE_REF}/${postFix}`)
  const res = await uploadBytes(storageRef, file).then(snapshot => getDownloadURL(snapshot.ref))
  return res
}
