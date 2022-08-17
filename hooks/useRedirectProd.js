import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuthContext } from './useAuthContext'
import { useUser } from './useUser'

export const useRedirectProd = () => {
  const { user } = useAuthContext()
  const { userDoc } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (user == null) {
      router.push('/login')
    }
    if (userDoc) {
      if (userDoc.producer == false) {
        router.push('/')
      }
    }
  }, [user, userDoc])

  if (!user) {
    return null
  }

  if (!userDoc?.producer) {
    return null
  }
}
