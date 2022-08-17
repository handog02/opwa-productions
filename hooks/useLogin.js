import { useEffect, useState } from 'react'
import { auth } from '../firebase/config'
import { useAuthContext } from './useAuthContext'
import { signInWithEmailAndPassword } from 'firebase/auth'

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()

  const login = async (email, password) => {
    setError(null)
    setIsPending(true)

    // sign the user in
    try {
      const res = await signInWithEmailAndPassword(auth, email, password)

      // dispatch login action
      dispatch({ type: 'LOGIN', payload: res.user })

      // update state
      if (!isCancelled) {
        setIsPending(false)
        setError(null)
      }
    }
    catch (err) {
      if (!isCancelled) {
        setError(err.message)
        setIsPending(false)
      }
    }

  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { login, error, isPending }

}
