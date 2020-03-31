import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'isomorphic-unfetch'
import { useRouter } from 'next/router'
import React from 'react'

function getCollectionRef(name) {
  return firebase.firestore().collection(name)
}

export const useQuestionSubscription = () => {
  const [questions, setQuestions] = React.useState([])

  const reply = async (questionId, { body, authorName, uid }) => {
    const questionRef = await getCollectionRef('questions').doc(questionId)
    const question = await questionRef.get()
    const comment = { uid, body, authorName }

    if (!question.exists) {
      comment.createdAt = firebase.firestore.FieldValue.serverTimestamp()
    }

    await questionRef.set({ comment }, { merge: true })
  }

  React.useEffect(() => {
    let unsubscribe = getCollectionRef('questions').onSnapshot(
      querySnapshot => {
        const messages = {}
        querySnapshot.forEach(function (doc) {
          messages[doc.id] = doc.data()
        })
        if (messages) setQuestions(messages)
      },
      error => {
        typeof unsubscribe === 'function' && unsubscribe()
        console.error(error)
      },
    )
  }, [])

  return { questions, reply }
}

export const useCommentsSubscription = id => {
  const [comments, setComments] = React.useState([])
  if (!id) {
    setComments([])
  }

  React.useEffect(() => {
    // listen for auth state changes
    let unsubscribe = getCollectionRef('comments')
      .where('parentId', '==', id)
      .orderBy('up', 'desc')
      .onSnapshot(
        snapshot => {
          if (snapshot.empty) {
            console.log('No matching documents.')
            return
          }
          const messages = {}
          snapshot.forEach(function (doc) {
            messages[doc.id] = doc.data()
          })
          if (messages) setComments(messages)
        },
        err => {
          console.log('Error getting documents', err)
          typeof unsubscribe === 'function' && unsubscribe()
        },
      )
    // unsubscribe to the listener when unmounting
    return () => typeof unsubscribe === 'function' && unsubscribe()
  }, [])

  return {
    comments,
  }
}

export const useTopicSubscription = id => {
  const [topic, setTopic] = React.useState('')
  if (!id) {
    setTopic('')
  }

  React.useEffect(() => {
    // listen for auth state changes
    let unsubscribe = getCollectionRef('messages')
      .doc(id)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.')
          return
        }

        setTopic(snapshot.data())
      })
      .catch(err => {
        console.log('Error getting documents', err)
        typeof unsubscribe === 'function' && unsubscribe()
      })
    // unsubscribe to the listener when unmounting
    return () => typeof unsubscribe === 'function' && unsubscribe()
  }, [])

  return {
    topic,
  }
}

export const useManageTopics = user => {
  const [messages, setMessages] = React.useState([])
  const createTopic = (text, title, authorName, isPublished = true, summary, type) => {
    getCollectionRef('messages').add({
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      text,
      title,
      summary,
      type,
      author: user.uid,
      up: 0,
      down: 0,
      authorName,
      isPublished,
      isDeleted: false,
    })
  }

  const deleteTopic = id => {
    getCollectionRef('messages').doc(`${id}`).update({ isDeleted: true, isPublished: false })
  }

  const updateTopic = (id, title, text, isPublished = true, summary, type) => {
    getCollectionRef('messages').doc(`${id}`).update({ title, text, isPublished, summary, type })
  }

  React.useEffect(() => {
    // listen for auth state changes
    let unsubscribe = getCollectionRef('messages').onSnapshot(
      querySnapshot => {
        const messages = {}
        querySnapshot.forEach(function (doc) {
          messages[doc.id] = doc.data()
        })
        if (messages) setMessages(messages)
      },
      error => {
        unsubscribe()
        console.error(error)
      },
    )
    // unsubscribe to the listener when unmounting
    return () => unsubscribe()
  }, [])

  return {
    createTopic,
    messages,
    deleteTopic,
    updateTopic,
  }
}

export const useAuth = () => {
  const router = useRouter()

  const [state, setState] = React.useState(() => {
    const user = firebase.auth().currentUser || null
    const initialState = {}
    if (user) {
      initialState.user = { uid: user.uid }
    }
    return initialState
  })

  function onChange(user) {
    if (!user) {
      router.push('/login')
      return
    }

    setState({ user: { ...user } })
  }

  React.useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(onChange)
    return () => unsubscribe()
  }, [])

  return state
}
