import { useEffect, useState } from 'react'
import { db } from '../firebase/config'
import { doc, onSnapshot } from 'firebase/firestore'
import { useAuthContext } from './useAuthContext'

export const useUser = () => {
  const { user } = useAuthContext()
  const [userDoc, setUserDoc] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      const ref = doc(db, 'users', user.uid)

      const unsub = onSnapshot(ref, doc => {
        setUserDoc(doc.data())
        setError(null)
      }, err => {
        console.log(err)
        setError('Could not fetch user data')
      })

      return () => unsub()
    }
  }, [user])

  return { userDoc, error }

}
