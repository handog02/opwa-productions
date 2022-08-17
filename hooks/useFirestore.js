import { useReducer, useEffect, useState } from 'react'
import { db } from '../firebase/config'
import { addDoc, Timestamp, collection, doc, deleteDoc, updateDoc, setDoc } from 'firebase/firestore'

let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null
}

const firestoreReducer = (state, action) => {
  switch (action.type) {
    case 'IS_PENDING':
      return { isPending: true, document: null, success: true, error: null }
    case 'ADDED_DOCUMENT':
      return { isPending: false, document: action.payload, success: true, error: null }
    case 'DELETED_DOCUMENT':
      return { isPending: false, document: null, success: true, error: null }
    case 'UPDATED_DOCUMENT':
      return { isPending: false, document: action.payload, success: true, error: null }
    case 'SET_DOCUMENT':
      return { isPending: false, document: action.payload, success: true, error: null }
    case 'ERROR':
      return { isPending: false, document: null, success: false, error: action.payload }
    default:
      return state
  }
}

export const useFirestore = (coll) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState)
  const [isCancelled, setIsCancelled] = useState(false)

  // collection ref
  const ref = collection(db, coll)

  // only dispatch if not cancelled
  const dispatchIfNotCancelled = (action) => {
    if (!isCancelled) {
      dispatch(action)
    }
  }

  // add document
  const addDocument = async (doc) => {
    dispatch({ type: 'IS_PENDING' })

    try {
      const addedDocument = await addDoc(ref, doc)
      dispatchIfNotCancelled({ type: 'ADDED_DOCUMENT', payload: addedDocument })
    }
    catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
    }
  }

  // delete document
  const deleteDocument = async (id) => {
    dispatch({ type: 'IS_PENDING' })
    
    try {
      await deleteDoc(doc(db, coll, id)) 
      dispatchIfNotCancelled({ type: 'DELETED_DOCUMENT' })
    } catch (err) {
      dispatchIfNotCancelled({ type: 'ERROR', payload: 'could not delete' })
    }
  }

  // update document
  const updateDocument = async (document, id) => {
    dispatch({ type: 'IS_PENDING' })

    try {
      const updatedDoc = await updateDoc(doc(db, coll, id), document)
      dispatchIfNotCancelled({ type: 'UPDATED_DOCUMENT', payload: updatedDoc })
    } catch (err) {
      console.log(err)
      dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
    }
  }

  // overwrite document
  const setDocument = async (document, id) => {
    dispatch({ type: 'IS_PENDING' })

    try {
      const settedDoc = await setDoc(doc(db, coll, id), document)
      dispatchIfNotCancelled({ type: 'SET_DOCUMENT', payload: settedDoc })
    } catch (err) {
      console.log(err)
      dispatchIfNotCancelled({ type: 'ERROR', payload: err.message })
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { setDocument, addDocument, deleteDocument, updateDocument, response }

}
