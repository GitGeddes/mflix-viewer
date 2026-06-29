import router from '@/router'
import { postCreateUser, postLogin } from '@/services/api'
import { ref, type Ref } from 'vue'

export default function useLogin() {
  const displayname: Ref<string | undefined> = ref(undefined)
  const username = ref('')
  const email = ref('')
  const password = ref('')

  async function onClickCreate() {
    const userDocumentResponse = await postCreateUser({
      email: email.value,
      password: password.value,
      username: username.value,
      displayname: displayname.value,
    })
    const response = await postLogin({
      email: email.value,
      password: password.value,
    })
    if (response) {
      // Navigate to the User page after logging in
      router.push('/user')
    }
  }

  // TODO: Remove this testing function
  async function onClickLogin() {
    const response = await postLogin({ email: 'test', password: 'testpass' })
    if (response) {
      // Navigate to the User page
      router.push('/user')
    }
  }

  async function onClickSubmit() {
    const response = await postLogin({
      email: email.value,
      password: password.value,
    })
    if (response) {
      // Navigate to the User page after logging in
      router.push('/user')
    }
  }

  return {
    displayname,
    username,
    email,
    password,
    onClickCreate,
    onClickLogin,
    onClickSubmit,
  }
}
