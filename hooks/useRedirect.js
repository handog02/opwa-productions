import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useAuthContext } from './useAuthContext'

export const useRedirect = () => {
  const { user } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (user == null) {
      router.push('/login')
    }
  }, [user])

  if (!user) {
    return null
  }
}