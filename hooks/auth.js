import firebase from 'firebase'
import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'

export const useAuth = () => {
  const router = useRouter()
  const [user, setUser] = useState(() => {
    const user = firebase.auth().currentUser || null
    return user ? {uid: user.uid} : {}
  })

  useEffect(() => firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      router.push('/login')
    } else {
      setUser({uid: user.uid, email: user.email})
    }
  }), [])

  useEffect(() => {
    if (!user?.uid) return
    return firebase.firestore()
      .collection('users')
      .doc(user.uid)
      .onSnapshot(userDoc => setUser({
        ...userDoc.data(),
        ...user,
      }))
  }, [user?.uid])

  return { user }
}
