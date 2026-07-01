import router from '@/router'
import {
  getSelfUser,
  postLogout,
  TOKEN_LOCAL_STORAGE_KEY,
  type UserInterface,
} from '@/services/api'
import { onMounted, ref, type Ref } from 'vue'

export default function useUser() {
  const user: Ref<UserInterface | undefined> = ref()

  onMounted(() => {
    fetchSelfUser()
  })

  async function fetchSelfUser() {
    const response = await getSelfUser()
    if (response) {
      user.value = response.user
    }
  }

  async function onClickLogout() {
    postLogout().then((res) => {
      if (res && res.ok) {
        // Delete the saved token because it is now invalid
        localStorage.removeItem(TOKEN_LOCAL_STORAGE_KEY)
        user.value = undefined
        // Navigate back to the home page
        router.push('/')
      }
    })
  }

  return {
    user,
    onClickLogout,
  }
}
