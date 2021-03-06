import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'isomorphic-unfetch'
import React, { useEffect, useState } from 'react'

function getCollectionRef(name) {
  return firebase.firestore().collection(name)
}

export const useQuestionSubscription = (user) => {
  const roles = user?.roles ?? [];
  const [questions, setQuestions] = useState([]);

  const reply = async (questionId, { body, authorName, uid }) => {
    const questionRef = await getCollectionRef('questions').doc(questionId);
    const question = await questionRef.get();
    let comment = { uid, body, authorName, createdAt: firebase.firestore.FieldValue.serverTimestamp() };

    const questionData = question.data();
    if (questionData?.comment) {
      comment = {
        ...questionData.comment,
        body,
      }
    }

    await questionRef.set({ comment }, { merge: true })
  };

  useEffect(() => {
    if (!roles.length) {
      return
    }

    return getCollectionRef('questions')
      .where('roles', 'array-contains-any', roles)
      .onSnapshot(querySnapshot => {
          const questions = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id
          }));
          if (questions) setQuestions(questions)
        },
        error => console.error(error),
      )
  }, [roles]);

  return { questions, reply }
};

export const useTopicSubscription = id => {
  const [topic, setTopic] = useState('');
  if (!id) {
    setTopic('')
  }

  useEffect(() => {
    // listen for auth state changes
    let unsubscribe = getCollectionRef('messages')
      .doc(id)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.');
          return
        }

        setTopic(snapshot.data())
      })
      .catch(err => {
        console.log('Error getting documents', err);
        typeof unsubscribe === 'function' && unsubscribe()
      });
    // unsubscribe to the listener when unmounting
    return () => typeof unsubscribe === 'function' && unsubscribe()
  }, []);

  return {
    topic,
  }
};

export const useManageTopics = user => {
  const [messages, setMessages] = useState([]);
  const createTopic = async (text, title, authorName, isPublished = true, summary, type) => {
    return await getCollectionRef('messages').add({
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      text,
      title,
      summary,
      type,
      author: user.uid,
      up: 0, down: 0,
      authorName,
      isPublished,
      isDeleted: false,
    })
  };

  const deleteTopic = async id => {
    return await getCollectionRef('messages')
      .doc(`${id}`)
      .update({ isDeleted: true, isPublished: false })
  };

  const updateTopic = async (id, title, text, isPublished = true, summary, type) => {
    return await getCollectionRef('messages')
      .doc(`${id}`)
      .update({ title, text, isPublished, summary, type })
  };

  const roles = user?.roles ?? [];
  useEffect(() => {
    if (!roles.length) {
      return
    }

    return getCollectionRef('messages')
      .where('roles', 'array-contains-any', roles)
      .onSnapshot(querySnapshot => {
          const messages = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id
          }));

          if (messages) {
            setMessages(messages)
          }
        },
        error => console.error(error),
      )
  }, [roles]);

  return {
    createTopic,
    messages,
    deleteTopic,
    updateTopic,
  }
};

