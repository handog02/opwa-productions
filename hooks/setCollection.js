import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore'
import { useEffect, useState, useRef } from 'react'
import { db } from '../firebase/config'

export const setCollection = (coll, _q1, _q2, _order) => {
  const [documents, setDocuments] = useState(null)
  const [error, setError] = useState(null)

  // if we don't use a ref --> infinite loop in useEffect
  // _q is an array and is "different" on every function call
  const q1 = useRef(_q1).current
  const q2 = useRef(_q2).current
  const order = useRef(_order).current

  useEffect(() => {
    let ref = collection(db, coll)

    if (q1 && !q2) {
      ref = query(ref, where(...q1))
    }
    if (q1 && q2) {
      ref = query(ref, where(...q1), where(...q2))
    }
    if (order) {
      ref = query(ref, orderBy(...order))
    }

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      let results = []
      snapshot.docs.forEach(doc => {
        results.push({ ...doc.data(), id: doc.id })
      })

      // update state
      setDocuments(results)
      setError(null)
    }, (error) => {
      console.log(error)
      setError('could not fetch the data')
    })

    // unsubscribe on unmount
    return () => unsubscribe()

  }, [coll, q1, q2, order])

  return { documents, error }
}
